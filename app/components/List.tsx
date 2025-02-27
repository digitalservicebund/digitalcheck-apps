import Heading, { type HeadingProps } from "./Heading";
import ListItem, { type ListItemProps } from "./ListItem";

// Common List Props
type BaseListProps = {
  identifier?: string;
  heading?: HeadingProps;
  items: ListItemProps[];
};

const NumberedList = ({ identifier, items, heading }: BaseListProps) => {
  return (
    <div className="ds-stack-8 relative scroll-my-40" id={identifier}>
      {heading && <Heading className="max-sm:ds-heading-02-reg" {...heading} />}
      <ol
        className="list-unstyled ds-stack-32 relative"
        aria-live="polite"
        aria-labelledby={identifier ? `${identifier}-heading` : undefined}
      >
        {items.map((item, index) => (
          <li
            key={
              item.identifier ??
              (typeof item.label?.text === "string"
                ? item.label.text
                : index.toString()) ??
              (typeof item.headline?.text === "string"
                ? item.headline.text
                : index.toString()) ??
              (typeof item.content === "string"
                ? item.content
                : index.toString())
            }
            className="scroll-my-40 first:pt-0"
            aria-describedby={
              item.identifier ? `${item.identifier}-desc` : undefined
            }
            aria-posinset={index + 1}
            aria-setsize={items.length}
          >
            <ListItem
              {...item}
              numeric={index + 1}
              parentHasHeading={heading !== undefined}
            />
          </li>
        ))}
      </ol>
    </div>
  );
};

const BulletList = ({ identifier, items, heading }: BaseListProps) => {
  return (
    <div className="ds-stack-8 relative scroll-my-40" id={identifier}>
      {heading && <Heading className="max-sm:ds-heading-02-reg" {...heading} />}
      <div className="absolute bottom-0 left-[8px] top-32 w-[4px] bg-blue-300">
        <div className="absolute -left-8 w-20 rotate-180 bg-white text-center text-xl leading-none text-blue-300">
          ▲
        </div>
        <div className="absolute -left-8 bottom-0 w-20 bg-white text-center text-xl leading-none text-blue-300">
          ▲
        </div>
      </div>
      <ol
        className="list-unstyled ds-stack-32 relative"
        aria-live="polite"
        aria-labelledby={identifier ? `${identifier}-heading` : undefined}
      >
        {items.map((item, index) => (
          <li
            key={
              item.identifier ??
              (typeof item.label?.text === "string"
                ? item.label.text
                : index.toString()) ??
              (typeof item.headline?.text === "string"
                ? item.headline.text
                : index.toString()) ??
              (typeof item.content === "string"
                ? item.content
                : index.toString())
            }
            className="scroll-my-40 first:pt-0"
            aria-describedby={
              item.identifier ? `${item.identifier}-desc` : undefined
            }
          >
            <ListItem
              {...item}
              numeric={undefined}
              parentHasHeading={heading !== undefined}
            />
          </li>
        ))}
      </ol>
    </div>
  );
};

export { BulletList, NumberedList };
