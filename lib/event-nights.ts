/**
 * How many nights an event lasts, from its dates.
 *
 * Counted in calendar days of the event's own time zone (a congress that runs
 * from 09:00 on the 1st to 18:00 on the 3rd is two nights), so a late finish
 * does not add a night. `null` when there is no end date or the event is a
 * single day: there is then nothing to say about nights.
 */
export function eventNights(
  startDate: string,
  endDate?: string | null,
  timeZone?: string | null,
): number | null {
  if (!endDate) return null;
  const day = (iso: string): number | null => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    let key: string;
    try {
      // `en-CA` formats as YYYY-MM-DD.
      key = new Intl.DateTimeFormat("en-CA", {
        timeZone: timeZone ?? undefined,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
    } catch {
      key = date.toISOString().slice(0, 10);
    }
    const [y, m, d] = key.split("-").map(Number);
    return Date.UTC(y, m - 1, d) / 86_400_000;
  };
  const from = day(startDate);
  const to = day(endDate);
  if (from === null || to === null) return null;
  const nights = to - from;
  return nights >= 1 ? nights : null;
}
