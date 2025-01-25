export function validateDecimalPlaces(numStr: string, maxDecimals: number) {
  // Regular expression to check if the number has more than maxDecimals places
  const regex = new RegExp(`^\\d+(\\.\\d{0,${maxDecimals}})?$`);
  return regex.test(numStr);
}
