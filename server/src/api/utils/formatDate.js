export function formatDate(dateString) {
  const date = new Date(dateString);

  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const formatter = new Intl.DateTimeFormat("en-US", {
    ...defaultOptions,
  });

  return formatter.format(date);
}
