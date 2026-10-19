export function linkToIEAArticle({
  article,
  recital,
}: {
  article?: number;
  recital?: number;
}) {
  const base =
    "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A32024R0903";
  if (!article && !recital) return base;
  return recital ? `${base}#rct_${recital}` : `${base}#art_${article}`;
}
