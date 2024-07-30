import classNames from "classnames";
import Heading, { type HeadingProps } from "./Heading";
import InfoBoxItem, { type InfoBoxItemProps } from "./InfoBoxItem";

type InfoBoxProps = {
  identifier?: string;
  label?: HeadingProps;
  heading?: HeadingProps;
  separator?: boolean;
  items: InfoBoxItemProps[];
};

const InfoBox = ({
  identifier,
  items,
  label,
  heading,
  separator = true,
}: InfoBoxProps) => {
  return (
    <div className="ds-stack-8 scroll-my-40" id={identifier}>
      {label && <Heading {...label} />}
      {heading && <Heading className="max-sm:ds-heading-02-reg" {...heading} />}
      <ul
        className={classNames("list-none ps-0 info-box", {
          "ds-stack-48": !separator,
          "ds-stack-32": separator,
        })}
      >
        {items.map((item, index) => (
          <InfoBoxItem
            separator={separator}
            {...item}
            key={item.identifier ?? index}
          />
        ))}
      </ul>
    </div>
  );
};

export default InfoBox;
