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
      {heading && <Heading {...heading} />}
      {!isNumeric && (
        <div className="absolute left-[8px] top-32 bottom-0 bg-blue-300 w-[4px]">
          {/* <div className="w-0 h-0 border-[20px] border-b-0 border-blue-300"></div> */}
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
