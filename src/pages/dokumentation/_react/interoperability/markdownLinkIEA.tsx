export function markdownLinkIEA({
  article,
  recital,
  paragraph,
  format = "short",
}: {
  article?: number;
  recital?: number;
  paragraph?: number;
  format?: "short" | "long";
}) {
  let text = recital ? `ErwG ${recital}` : `Art. ${article}`;
  if (paragraph) {
    const paragraphName = article === 2 ? "Nr." : "Abs.";
    text += ` ${paragraphName} ${paragraph}`;
  }

  text +=
    format === "long"
      ? " der Verordnung für ein interoperables Europa (EU) 2024/903"
      : " der Verordnung (EU) 2024/903";
  const href = linkToIEAArticle({ article, recital });
  return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
}

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
