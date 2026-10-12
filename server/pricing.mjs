export function sessionPrice(hourlyRate, durationMinutes) {
  return Math.round(Number(hourlyRate) * Number(durationMinutes) / 60);
}
