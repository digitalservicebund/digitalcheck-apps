import { marked, Marked, type Renderer, type Tokens } from "marked";
import twMerge from "utils/tailwind-merge";
import { A11Y_MESSAGE_NEW_WINDOW } from "./Aria";
import { openInNewIconString } from "./openInNewWindow";

export type RichTextProps = {
  markdown: string;
  className?: string;
  rendererOptions?: Partial<Renderer>;
};

const RichText = ({
  markdown,
  className,
  rendererOptions,
  ...props
}: RichTextProps) => {
  const extension = {
    useNewRenderer: true,
    renderer: {
      link(token: Tokens.Link) {
        const { href } = token;
        // render the link with the default renderer or a renderer that has overridden it
        const linkHtml = marked.parseInline(token.raw) as string;

        // Force external links to open in a new window
        if (href.startsWith("http")) {
          const newLinkHtml = linkHtml
            .replace(
              /^<a /,
              `<a target="_blank" aria-describedby=${A11Y_MESSAGE_NEW_WINDOW} rel="noopener noreferrer" class="inline-" `,
            )
            .replace(
              `>${token.text}<`,
              `>${token.text} ${openInNewIconString}<`,
            );

          return newLinkHtml;
        }

        const ext =
          (href.endsWith(".pdf") && "PDF") ||
          (href.endsWith(".xlsx") && "XLSX");

        // Force the browser to download links to PDF/Excel files
        if (ext === "PDF" || ext === "XLSX") {
          return linkHtml.replace(
            /^<a /,
            `<a download title="${`${token.text} (${ext}-Datei)`}" `,
          );
        }

        return linkHtml;
      },
      ...rendererOptions,
    },
  };

  const newMarked = new Marked(extension);
  const html = newMarked.parse(markdown);

  return html ? (
    <div
      {...props}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      className={twMerge("rich-text ds-stack-8", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : null;
};

export default RichText;
