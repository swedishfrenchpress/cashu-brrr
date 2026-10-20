// One set of formatters so every timestamp, amount, and countdown reads the same way.

export const fmtNum = (n: number) => new Intl.NumberFormat("en-US").format(n);

const time: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hourCycle: "h23" };

/** 19:15:53 */
export const fmtClock = (t: number) => new Date(t).toLocaleTimeString([], { ...time, second: "2-digit" });

/** 19 Oct 2026 */
export const fmtDate = (t: number) =>
  new Date(t).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });

/** 19 Oct 2026, 19:15 */
export const fmtDateTime = (t: number) => `${fmtDate(t)}, ${new Date(t).toLocaleTimeString([], time)}`;

/** 9:41 or 1:00:16 */
export const fmtDuration = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
};
