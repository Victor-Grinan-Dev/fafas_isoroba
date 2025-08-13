export const parseDateString = (str) => {
  const match = str.match(/Date\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)/);
  if (!match) return str;
  const [_, year, month, day, hour, minute, second] = match.map(Number);
  return new Date(year, month, day, hour, minute, second).toISOString();
}