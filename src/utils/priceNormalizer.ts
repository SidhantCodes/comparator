export function normalizeINRPrice(
  rawPrice: string | null | undefined
): number | "unavailable" {
  if (!rawPrice) return "unavailable";

  // Match ₹ followed by any non-digit chars, then digits/commas
  const inrMatch = rawPrice.match(/₹[^\d]*([\d,]+)/);

  if (!inrMatch || !inrMatch[1]) {
    return "unavailable";
  }

  // Remove commas and convert to number
  const numericValue = Number(inrMatch[1].replace(/,/g, ""));

  return isNaN(numericValue) ? "unavailable" : numericValue;
}
