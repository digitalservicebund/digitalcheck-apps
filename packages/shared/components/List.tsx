import Heading, { type HeadingProps } from "./Heading";
import ListItem, { type ListItemProps } from "./ListItem";

type ListProps = {
  identifier?: string;
  heading?: HeadingProps;
  items: ListItemProps[];
  isNumeric?: boolean;
};

const List = ({ identifier, items, heading, isNumeric }: ListProps) => {
  return (
    <div className="scroll-my-40 relative ds-stack-8" id={identifier}>
      {heading && <Heading className="max-sm:ds-heading-02-reg" {...heading} />}
      {!isNumeric && (
        <div className="absolute left-[8px] top-32 bottom-0 bg-blue-300 w-[4px]">
          <div className="text-blue-300 bg-white w-[20px] -left-[8px] absolute text-center text-xl leading-none rotate-180">
            ▲
          </div>
          <div className="text-blue-300 bg-white w-[20px] -left-[8px] bottom-0 absolute text-center text-xl leading-none">
            ▲
          </div>
        </div>
      )}
      <ol className="list-none ds-stack-32 ps-0 relative">
        {items.map((item, index) => {
          return (
            <li
              key={
                item.identifier ??
                item.label?.text ??
                item.headline?.text ??
                item.content
              }
              className="first:pt-0 scroll-my-40"
            >
              <ListItem
                {...item}
                numeric={isNumeric ? index + 1 : undefined}
                parentHasHeading={heading !== undefined}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default List;
