import classNames from "classnames";
import Heading, { type HeadingProps } from "./Heading";
import InfoBoxItem, { type InfoBoxItemProps } from "./InfoBoxItem";

type InfoBoxProps = {
  identifier?: string;
  heading?: HeadingProps;
  separator?: boolean;
  items: InfoBoxItemProps[];
};

const InfoBox = ({
  identifier,
  items,
  heading,
  separator = true,
}: InfoBoxProps) => {
  return (
    <div className="ds-stack-8 scroll-my-40" id={identifier}>
      {heading && <Heading {...heading} />}
      <ul
        className={classNames("list-none ps-0 info-box", {
          "ds-stack-48": !separator,
          "ds-stack-32": separator,
        })}
      >
        {items.map((item) => (
          <InfoBoxItem
            separator={separator}
            {...item}
            key={
              item.identifier ??
              item.headline?.text ??
              item.content ??
              item.label?.text ??
              ""
            }
          />
        ))}
      </ul>
    </div>
  );
};

export default InfoBox;
