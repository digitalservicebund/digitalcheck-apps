export const slugify = (string: string) =>
  string.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");

export const formatDate = (date: string | undefined) => {
  return date
    ? new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(date))
    : undefined;
};

export const gesetzStatusMap = {
  Verkuendetes_Gesetz_aktuelle_Fassung: "Verkündetes Gesetz (aktuelle Fassung)",
  Regelungsentwurf: "Regelungsentwurf",
  Text_im_Parlament: "Text im Parlament",
};
