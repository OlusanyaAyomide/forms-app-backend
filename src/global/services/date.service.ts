export function areDatesEqual(
  dateA: string | Date | null | undefined,
  dateB: string | Date | null | undefined
): boolean {

  if (!dateA || !dateB) return false;

  const d1 = new Date(dateA);
  const d2 = new Date(dateB);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    throw new Error("One or both dates are invalid");
  }

  return d1.getTime() === d2.getTime();
}
