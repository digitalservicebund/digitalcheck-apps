import Heading, { type HeadingProps } from "./Heading";
import RichText, { type RichTextProps } from "./RichText";

type HeaderProps = {
  heading: HeadingProps;
  content?: RichTextProps;
};

export default function Header({ heading, content }: HeaderProps) {
  return (
    <div className="ds-stack-16">
      <Heading {...heading} />
      {content && (
        <div className="ds-heading-03-reg">
          <RichText {...content} />
        </div>
      )}
    </div>
  );
}
