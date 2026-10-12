export const contact = {
  email: "digitalcheck@digitalservice.bund.de",
  interoperabilityEmail: "interoperabel@digitalservice.bund.de",
  nkrEmail: "poststelle@nkr.bund.de",
  bmdsEmail: "SBII3@bmds.bund.de",
  mdMailToLink: (email: string, subject?: string) =>
    subject
      ? `[${email}](mailto:${email}?subject=${encodeURIComponent(subject)})`
      : `[${email}](mailto:${email})`,
  // Adds <wbr> after "@" and before each "." to allow clean line breaks
  emailDisplayHtml: (email: string) => email.replace(/@|(?=\.)/g, "$&<wbr>"),
  phoneDisplay: "0151 / 4076 7839",
  phone: "tel:+4915140767839",
  mdPhoneLink: () => `[${contact.phoneDisplay}](${contact.phone})`,
};
