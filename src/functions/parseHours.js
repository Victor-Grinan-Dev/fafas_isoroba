export const formatTime = (cell) => {
  if (cell instanceof Date) {
    return cell.toTimeString().slice(0,5); // "HH:MM"
  }
  return cell;
}