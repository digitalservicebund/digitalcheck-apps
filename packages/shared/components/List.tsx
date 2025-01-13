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
    <div className="scroll-my-40 relative ds-stack-8" id={identifier}>
      {heading && <Heading className="max-sm:ds-heading-02-reg" {...heading} />}
      <ol
        className="list-none ps-0 max-w-none ds-stack-32 relative"
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
            className="first:pt-0 scroll-my-40"
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
    <div className="scroll-my-40 relative ds-stack-8" id={identifier}>
      {heading && <Heading className="max-sm:ds-heading-02-reg" {...heading} />}
      <div className="absolute left-[8px] top-32 bottom-0 bg-blue-300 w-[4px]">
        <div className="text-blue-300 bg-white w-[20px] -left-[8px] absolute text-center text-xl leading-none rotate-180">
          ▲
        </div>
        <div className="text-blue-300 bg-white w-[20px] -left-[8px] bottom-0 absolute text-center text-xl leading-none">
          ▲
        </div>
      </div>
      <ol
        className="list-none ps-0 max-w-none ds-stack-32 relative"
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
            className="first:pt-0 scroll-my-40"
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
