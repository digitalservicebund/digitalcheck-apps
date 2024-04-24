import { Marked } from "marked";
import { A11Y_MESSAGE_NEW_WINDOW } from "./Aria";

export type RichTextProps = {
  markdown: string;
  className?: string;
};

const RichText = ({ markdown, className, ...props }: RichTextProps) => {
  const marked = new Marked();

  const renderer = new marked.Renderer();
  const linkRenderer = renderer.link;
  renderer.link = (href, title, text) => {
    const linkHtml = linkRenderer.call(renderer, href, title, text);
    // Open external links in new tab
    // TODO: This doesnt work due to enableAutoOutboundTracking() from Plausible
    if (href.startsWith("http")) {
      return linkHtml.replace(
        /^<a /,
        `<a target="_blank" aria-describedby=${A11Y_MESSAGE_NEW_WINDOW} `,
      );
    }
    return linkHtml;
  };

  const html = marked.parse(markdown, { renderer });

  return html ? (
    <div
      {...props}
      className={`rich-text ds-stack-8 ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : null;
};

export default RichText;
