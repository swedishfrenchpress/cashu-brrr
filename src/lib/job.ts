import { MintQuoteState, getEncodedTokenV4, type MintQuoteResponse, type Proof, type Token } from "@cashu/cashu-ts";
import { get } from "svelte/store";
import encodeQR from "qr";
import JSZip from "jszip";
import type { Event, Filter } from "nostr-tools";
import { discoveredMints, mint, pool, prints, wallet } from "./stores.svelte";
import { createOutputAmount, createOutputAmounts, delay, getAmountForTokenSet, getWalletWithUnit, loadMint } from "./utils";
import { DEFAULT_RELAYS } from "../nostr";
import type { StyleRef, TemplateRef } from "./templates";

/** cashu-ts reassigns `token.proofs` while encoding; encode a copy so stored and reactive tokens stay untouched. */
export const encodeToken = (token: Token): string => getEncodedTokenV4({ ...token, proofs: [...token.proofs] });

export const SUGGESTED_MINTS = ["https://mint.minibits.cash/Bitcoin", "https://mint.lnvoltz.com"];

export const formatMintUrl = (url: string): string => {
  const trimmed = url.trim().replace(/\/+$/, "");
  return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export const shortMint = (url: string | undefined): string => (url ?? "").replace(/^https?:\/\//, "");

/** Turn a connection failure into something an organizer can act on. */
const describeMintError = (error: any, url: string): string => {
  const message = String(error?.cause?.message ?? error?.message ?? "");
  if (message.includes("CORS")) return `${shortMint(url)} doesn't accept connections from this site. Pick another mint.`;
  if (message.includes("404")) return `No mint found at ${shortMint(url)}. Check the URL.`;
  if (message.toLowerCase().includes("fetch")) return `Couldn't reach ${shortMint(url)}. Check the URL or your connection.`;
  return `Couldn't connect to ${shortMint(url)}. Check the URL or pick another mint.`;
};

export const connectMint = async (url: string) => {
  const formatted = formatMintUrl(url);
  try {
    const m = await loadMint(formatted);
    const w = await getWalletWithUnit(m, "sat");
    mint.set(m);
    wallet.set(w);
    return m;
  } catch (error) {
    console.error("Mint connection failed:", error, (error as any)?.cause);
    throw new Error(describeMintError(error, formatted), { cause: error });
  }
};

/** Mints announced on Nostr (NIP-87). Collects for two seconds. */
export const discoverMintsOnNostr = async () => {
  discoveredMints.set([]);
  const filter: Filter = { kinds: [38000], limit: 2000 };
  const sub = pool.subscribeMany(DEFAULT_RELAYS, [filter], {
    onevent: (event: Event) => {
      const uTag = event.tags.find((t) => t[0] === "u");
      const kTag = event.tags.find((t) => t[0] === "k");
      if (!uTag || !kTag || kTag[1] !== "38172") return;
      discoveredMints.add(uTag[1]);
    },
  });
  await delay(2000);
  sub.close();
  return get(discoveredMints);
};

export const requestInvoice = async (amount: number): Promise<MintQuoteResponse> => {
  const w = get(wallet);
  if (!w) throw new Error("Connect a mint before paying.");
  return w.createMintQuote(amount);
};

export const quoteIsPaid = async (quote: MintQuoteResponse): Promise<boolean> => {
  const w = get(wallet);
  const updated = await w.checkMintQuote(quote.quote);
  return updated.state === MintQuoteState.PAID;
};

/** Group minted proofs into one token per note, each worth exactly `denomination`. */
const splitIntoNotes = async (proofs: Proof[], mintUrl: string, denomination: number, count: number) => {
  const remaining = [...proofs];
  const perNote = await createOutputAmount(denomination);
  const tokens: Token[] = [];
  for (let i = 0; i < count; i++) {
    const token: Token = { mint: mintUrl, unit: "sat", proofs: [] };
    for (const amount of perNote) {
      const index = remaining.findIndex((p) => p.amount === amount);
      if (index === -1) throw new Error("The mint returned amounts that don't add up to whole notes.");
      token.proofs.push(...remaining.splice(index, 1));
    }
    tokens.push(token);
  }
  return tokens;
};

export type MintedJob = { tokens: Token[]; ts: number };

export const mintNotes = async (
  quote: MintQuoteResponse,
  denomination: number,
  count: number,
  template: TemplateRef,
  style: StyleRef,
): Promise<MintedJob> => {
  const w = get(wallet);
  const m = get(mint);
  const outputAmounts = await createOutputAmounts(denomination, count, true);
  const proofs = await w.mintProofs(denomination * count, quote.quote, { outputAmounts });
  const tokens = await splitIntoNotes(proofs, m.url, denomination, count);

  const encoded = tokens.map(encodeToken);
  if (new Set(encoded).size !== encoded.length) {
    throw new Error("Two notes came out identical, so only one of them would work. Don't print this sheet.");
  }

  const ts = Date.now();
  prints.update((all) => [...all, { tokens, mint: m.url, ts, template, style }]);
  return { tokens, ts };
};

export const totalOf = (tokens: Token[]) => getAmountForTokenSet(tokens.flatMap((t) => t.proofs));

/** A ZIP of one white-backed QR SVG per note: the backup for notes not yet handed out. */
export const downloadQrBackup = async (tokens: Token[], amount: number) => {
  const zip = new JSZip();
  tokens.forEach((token, i) => {
    let svg = encodeQR(encodeToken(token), "svg");
    const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1]?.split(" ");
    const w = viewBox ? parseFloat(viewBox[2]) : 100;
    const h = viewBox ? parseFloat(viewBox[3]) : 100;
    const open = svg.indexOf(">", svg.indexOf("<svg")) + 1;
    svg = svg.slice(0, open) + `<rect width="${w}" height="${h}" fill="white"/>` + svg.slice(open);
    zip.file(`${amount}_sats_${i + 1}.svg`, svg);
  });
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cashu_qr_codes.zip";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
