import { Marked } from "marked";
import { A11Y_MESSAGE_NEW_WINDOW } from "./Aria";

export type RichTextProps = {
  markdown: string;
  className?: string;
};

const RichText = ({ markdown, className, ...props }: RichTextProps) => {
  const marked = new Marked();
  const originalRenderer = new marked.Renderer();
  const renderer = {
    link(href: string, title: string | null | undefined, text: string) {
      const linkHtml = originalRenderer.link(href, title, text);
      // Force external links to open in a new window
      if (href.startsWith("http")) {
        return linkHtml.replace(
          /^<a /,
          `<a target="_blank" aria-describedby=${A11Y_MESSAGE_NEW_WINDOW} `,
        );
      }
      // Force the browser to download links to PDF files
      if (href.endsWith(".pdf")) {
        return linkHtml.replace(/^<a /, `<a download `);
      }
      return linkHtml;
    },
  };

  marked.use({ renderer });
  const html = marked.parse(markdown);

  return html ? (
    <div
      {...props}
      className={`rich-text ds-stack-8 ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : null;
};

export default RichText;
