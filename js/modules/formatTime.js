const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Ulaanbaatar', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hour12: false,
});

export function formatUlaanbaatarTime(value) {
  const parts = Object.fromEntries(formatter.formatToParts(new Date(value))
    .map(part => [part.type, part.value]));
  return `${parts.year}.${parts.month}.${parts.day} ${parts.hour}:${parts.minute} (УБ)`;
}
