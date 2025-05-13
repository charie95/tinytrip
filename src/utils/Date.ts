export function getDateRange(start: string, end: string): string[] {
  const result = [];
  const current = new Date(start);
  const last = new Date(end);
  while (current <= last) {
    result.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return result;
}
