export const buildQuery = (
  queries: Record<string, string | number | undefined | null>
) => {
  if (Object.values(queries).every((val) => !val)) return '';

  const query = Object.entries(queries)
    .map(([key, value]) => {
      if (value === undefined || value === null) return '';
      return `${key}=${value}`;
    })
    .filter((val) => val)
    .join('&');

  return `?${query}`;
};
