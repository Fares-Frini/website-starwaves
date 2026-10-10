import Decimal from "decimal.js";

/**
 * Money handling.
 *
 * Two facts drive everything here, both verified against the running API:
 *
 *   1. Money *leaves* the API as an exact unscaled decimal string — "120.5",
 *      "0.001", "1000". The columns are `Decimal(14,3)` and are serialised with
 *      `.toFixed()`, so the API deliberately does not pad. Formatting is ours.
 *
 *   2. Money *enters* the API as a JSON number: the request DTOs are
 *      `@IsNumber()` and the validation pipe runs with implicit conversion
 *      off, so a string body is rejected outright.
 *
 * That asymmetry is the whole reason this module exists. Amounts are carried as
 * strings and only converted to a number at the moment of sending, so no
 * intermediate float rounding can creep in.
 *
 * The dinar divides into 1000 millimes, so TND takes THREE decimals, not two.
 */

/** Decimal places per currency. Anything unlisted falls back to 2. */
const CURRENCY_SCALE: Record<string, number> = {
  TND: 3, // 1 dinar = 1000 millimes
  LYD: 3,
  BHD: 3,
  KWD: 3,
  OMR: 3,
  IQD: 3,
  JOD: 3,
  EUR: 2,
  USD: 2,
  GBP: 2,
  CHF: 2,
  MAD: 2,
  DZD: 2,
  JPY: 0,
};

export function scaleFor(currency: string): number {
  return CURRENCY_SCALE[currency.toUpperCase()] ?? 2;
}

/** An amount as it travels: the exact string the API gave us. */
export type MoneyString = string;

/**
 * Format an API amount for display.
 *
 * `"120.5"` in TND renders as `120,500 TND` in French and `120.500 TND` in
 * English — the separator follows the locale, the *scale* follows the currency.
 */
export function formatMoney(
  amount: MoneyString | null | undefined,
  currency: string,
  locale: string = "fr",
): string {
  if (amount === null || amount === undefined || amount === "") return "—";

  const scale = scaleFor(currency);
  let fixed: string;
  try {
    fixed = new Decimal(amount).toFixed(scale);
  } catch {
    // A malformed amount is a server contract violation; show it rather than
    // crashing a whole page over one cell, so it gets noticed and reported.
    return `${amount} ${currency}`;
  }

  const [whole, fraction] = fixed.split(".");
  const groupedWhole = new Intl.NumberFormat(locale, {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(BigInt(whole.replace("-", "")));

  const decimalSep = locale.startsWith("fr") ? "," : ".";
  const sign = fixed.startsWith("-") ? "-" : "";
  const body = fraction ? `${groupedWhole}${decimalSep}${fraction}` : groupedWhole;

  return `${sign}${body} ${currency.toUpperCase()}`;
}

/**
 * Convert an amount to the JSON number the write endpoints expect.
 *
 * Throws on anything that cannot round-trip exactly, rather than silently
 * sending a value that differs from what the user typed.
 */
export function toApiNumber(amount: MoneyString, currency: string): number {
  const d = new Decimal(amount);
  const scale = scaleFor(currency);
  if (d.decimalPlaces() > scale) {
    throw new RangeError(
      `${currency} allows ${scale} decimal places; received "${amount}".`,
    );
  }
  const n = d.toNumber();
  if (!new Decimal(n).equals(d)) {
    throw new RangeError(`Amount "${amount}" cannot be represented exactly.`);
  }
  return n;
}

/** Parse user input (either separator) into an exact amount string. */
export function parseMoneyInput(input: string): MoneyString | null {
  const cleaned = input.trim().replace(/\s| /g, "").replace(",", ".");
  if (cleaned === "") return null;
  try {
    const d = new Decimal(cleaned);
    return d.isFinite() ? d.toFixed() : null;
  } catch {
    return null;
  }
}

/**
 * Compare amounts without going through a float.
 *
 * Note this is for *display* decisions only — "is this balance settled" style
 * questions. Never compute a total, discount or balance to send back; ask the
 * API for those.
 */
export function isZero(amount: MoneyString): boolean {
  try {
    return new Decimal(amount).isZero();
  } catch {
    return false;
  }
}

export function isPositive(amount: MoneyString): boolean {
  try {
    return new Decimal(amount).greaterThan(0);
  } catch {
    return false;
  }
}
