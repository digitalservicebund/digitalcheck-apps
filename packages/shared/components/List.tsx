import Heading, { type HeadingProps } from "./Heading";
import ListItem, { type ListItemProps } from "./ListItem";

type ListProps = {
  identifier?: string;
  heading?: HeadingProps;
  items: ListItemProps[];
  isNumeric?: boolean;
};

const List = ({ identifier, items, heading, isNumeric }: ListProps) => {
  let counter = 0;

  return (
    <div className="ds-stack-8 scroll-my-40" id={identifier}>
      {heading && <Heading {...heading} />}
      <ol className="list-none ds-stack-32 ps-0">
        {items.map((item) => {
          counter = isNumeric && !item.spacer ? counter + 1 : counter;
          return (
            <li
              key={
                item.identifier ??
                item.label?.text ??
                item.headline?.text ??
                item.spacer?.text ??
                item.content
              }
              className="first:pt-0 scroll-my-40"
            >
              <ListItem {...item} numeric={isNumeric ? counter : undefined} />
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default List;
