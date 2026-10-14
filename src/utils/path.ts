export const removeTrailingSlash = (path: string) =>
  path.replace(/\/$/, "").replace(/^$/, "/");

// Prefix a root-relative URL path with the site’s base path if set.
// Leaves external, protocol-relative, anchor and relative URLs untouched,
// as well as paths that already contain the base (e.g. from routes.ts).
export const withBase = (path: string) => {
  const base = (import.meta.env?.BASE_URL ?? "/").replace(/\/$/, "");
  const isRootRelative = path.startsWith("/") && !path.startsWith("//");
  const hasBase =
    !!base &&
    (path === base ||
      path.startsWith(`${base}/`) ||
      path.startsWith(`${base}#`) ||
      path.startsWith(`${base}?`));
  return isRootRelative && !hasBase ? base + path : path;
};

// Ignore / and # for path comparison
export const normalizePathname = (path: string) => {
  return removeTrailingSlash(path).split("#")[0];
};
