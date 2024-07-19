import { marked, Marked, Tokens } from "marked";
import { A11Y_MESSAGE_NEW_WINDOW } from "./Aria";

export type RichTextProps = {
  markdown: string;
  className?: string;
};

const RichText = ({ markdown, className, ...props }: RichTextProps) => {
  const extension = {
    useNewRenderer: true,
    renderer: {
      link(token: Tokens.Link) {
        const { href } = token;
        // render the link with the default renderer or a renderer that has overridden it
        const linkHtml = marked.parseInline(token.raw) as string;

        // Force external links to open in a new window
        if (href.startsWith("http")) {
          return linkHtml.replace(
            /^<a /,
            `<a target="_blank" aria-describedby=${A11Y_MESSAGE_NEW_WINDOW} `,
          );
        }

        // Force the browser to download links to PDF/Excel files
        if (href.endsWith(".pdf") || href.endsWith(".xlsx")) {
          return linkHtml.replace(/^<a /, `<a download `);
        }

        return linkHtml;
      },
    },
  };

  const newMarked = new Marked(extension);
  const html = newMarked.parse(markdown);

  return html ? (
    <div
      {...props}
      className={`rich-text ds-stack-8 ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : null;
};

export default RichText;
