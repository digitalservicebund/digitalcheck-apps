import Heading, { type HeadingProps } from "./Heading";
import RichText, { type RichTextProps } from "./RichText";

type HeaderProps = {
  heading: HeadingProps;
  content?: RichTextProps;
};

export default function Header({ heading, content }: HeaderProps) {
  return (
    <div className="ds-stack-16 max-w-[70ch]">
      <Heading {...heading} />
      {content && (
        <div className="ds-subhead">
          <RichText {...content} />
        </div>
      )}
    </div>
  );
}
