export type NoteType = "comic" | "custom" | "sovereign" | "chaum" | "meadows";

export type NoteStyle = {
  id: string;
  name: string;
  design?: number | string;
  colorCode?: string;
};

export type NoteFamily = {
  type: NoteType;
  name: string;
  styles: NoteStyle[];
  /** width / height of the artwork, used to size print cells */
  aspect: number;
};

// Shapes stored in history and print data; kept compatible with older prints.
export type TemplateRef = {
  id: string;
  name: string;
  type: NoteType;
  design?: number | string;
};
export type StyleRef = TemplateRef & { colorCode?: string };

const comicStyles: NoteStyle[] = Array.from({ length: 23 }, (_, i) => {
  const design = i + 3;
  return { id: `comic-${design}`, name: `No. ${design}`, design };
});

const sovereignStyles: NoteStyle[] = [
  { id: "Soverign_Note.png", name: "Classic Sovereign", design: "Soverign_Note.png" },
  { id: "Leafy-Nature-Note.png", name: "Leafy Nature", design: "Leafy-Nature-Note.png" },
  { id: "Nostr-note-1.png", name: "Nostr I", design: "Nostr-note-1.png" },
  { id: "Nostr-note-2.png", name: "Nostr II", design: "Nostr-note-2.png" },
  { id: "Nostr-Note-3.png", name: "Nostr III", design: "Nostr-Note-3.png" },
  { id: "Pizza-day-orange.png", name: "Pizza Day Orange", design: "Pizza-day-orange.png" },
  { id: "Pizzaday-green.png", name: "Pizza Day Green", design: "Pizzaday-green.png" },
  { id: "Satoshi-nirvana.png", name: "Satoshi Nirvana", design: "Satoshi-nirvana.png" },
  { id: "Taj-India-Note.png", name: "Taj India", design: "Taj-India-Note.png" },
  { id: "Your-honor.png", name: "Your Honor", design: "Your-honor.png" },
];

const customStyles: NoteStyle[] = [
  { id: "orange", name: "Orange", colorCode: "#E4690A" },
  { id: "blue", name: "Blue", colorCode: "#3B82F6" },
  { id: "green", name: "Green", colorCode: "#10B981" },
  { id: "purple", name: "Purple", colorCode: "#8B5CF6" },
  { id: "red", name: "Red", colorCode: "#EF4444" },
  { id: "pink", name: "Pink", colorCode: "#EC4899" },
];

export const FAMILIES: NoteFamily[] = [
  { type: "chaum", name: "Chaum Note", aspect: 2216 / 1147, styles: [{ id: "chaum-1", name: "Chaum Note" }] },
  { type: "comic", name: "Bitpopart", aspect: 420.33 / 214.49, styles: comicStyles },
  { type: "sovereign", name: "Sovereign", aspect: 3500 / 1672, styles: sovereignStyles },
  { type: "meadows", name: "Mr. Meadows", aspect: 595 / 239, styles: [{ id: "meadows-1", name: "Mr. Meadows" }] },
  { type: "custom", name: "Custom Note", aspect: 534 / 279, styles: customStyles },
];

export const familyOf = (type: NoteType | undefined): NoteFamily =>
  FAMILIES.find((f) => f.type === type) ?? FAMILIES[0];

/** The default style a family opens on. Bitpopart opens on No. 7, as it always has. */
export const defaultStyle = (family: NoteFamily): NoteStyle =>
  family.type === "comic" ? family.styles.find((s) => s.design === 7)! : family.styles[0];

export const templateRef = (family: NoteFamily): TemplateRef => ({
  id: `${family.type}-1`,
  name: family.name,
  type: family.type,
});

export const styleRef = (family: NoteFamily, style: NoteStyle): StyleRef => ({
  id: style.id,
  name: style.name,
  type: family.type,
  design: style.design,
  colorCode: style.colorCode,
});

/** Resolve whatever an older or newer print stored into a family + style. */
export const resolveDesign = (
  template?: TemplateRef | null,
  style?: StyleRef | null,
): { family: NoteFamily; style: NoteStyle } => {
  const family = familyOf(template?.type ?? style?.type);
  const match =
    family.styles.find((s) => style?.design !== undefined && s.design === style.design) ??
    family.styles.find((s) => style?.colorCode && s.colorCode === style.colorCode) ??
    defaultStyle(family);
  return { family, style: match };
};

/** Print cell in millimetres: 130 x 65 at most, keeping the artwork's own proportions. */
export const NOTE_MAX_W = 130;
export const NOTE_MAX_H = 65;
export const cellSize = (family: NoteFamily) => {
  const w = Math.min(NOTE_MAX_W, NOTE_MAX_H * family.aspect);
  return { w, h: w / family.aspect };
};

export const NOTES_PER_SHEET = 6;

export type PaperSize = "a4" | "letter";
export const PAPER: Record<PaperSize, { label: string; w: number; h: number; css: string }> = {
  a4: { label: "A4", w: 297, h: 210, css: "A4 landscape" },
  letter: { label: "Letter", w: 279.4, h: 215.9, css: "letter landscape" },
};

export type CutMark = { x1: number; y1: number; x2: number; y2: number };

/**
 * Where the six notes and their cut marks sit on a landscape sheet, in mm.
 * Notes butt together in a 2 x 3 block so one cut separates two notes; the
 * marks sit in the margin on every cut line.
 */
export const sheetLayout = (family: NoteFamily, paper: PaperSize) => {
  const page = PAPER[paper];
  const cell = cellSize(family);
  const cols = 2;
  const rows = 3;
  const gridW = cols * cell.w;
  const gridH = rows * cell.h;
  const x0 = (page.w - gridW) / 2;
  const y0 = (page.h - gridH) / 2;
  const gap = 1.5;
  const lenY = Math.max(2, Math.min(5, y0 - gap - 1.5));
  const lenX = Math.max(2, Math.min(5, x0 - gap - 1.5));

  const marks: CutMark[] = [];
  for (let c = 0; c <= cols; c++) {
    const x = x0 + c * cell.w;
    marks.push({ x1: x, y1: y0 - gap - lenY, x2: x, y2: y0 - gap });
    marks.push({ x1: x, y1: y0 + gridH + gap, x2: x, y2: y0 + gridH + gap + lenY });
  }
  for (let r = 0; r <= rows; r++) {
    const y = y0 + r * cell.h;
    marks.push({ x1: x0 - gap - lenX, y1: y, x2: x0 - gap, y2: y });
    marks.push({ x1: x0 + gridW + gap, y1: y, x2: x0 + gridW + gap + lenX, y2: y });
  }

  return { page, cell, cols, rows, gridW, gridH, x0, y0, marks };
};

export const chunk = <T>(items: T[], size = NOTES_PER_SHEET): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, i * size + size));

/** Text encoded in specimen QRs. Scanning it never looks like money. */
export const SPECIMEN_TOKEN = "SPECIMEN - not money. Print your own ecash notes with Cashu Brrr.";
