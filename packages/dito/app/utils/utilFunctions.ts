export const slugify = (string: string) =>
  string.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
