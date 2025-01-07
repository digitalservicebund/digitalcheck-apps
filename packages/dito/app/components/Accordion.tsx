import AccordionItem, { AccordionItemProps } from "./AccordionItem";

export default function Accordion({ items }: { items: AccordionItemProps[] }) {
  return (
    <div className="bg-white border-b-2 border-b-blue-800">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          headline={item.headline}
          content={item.content}
          id={item.id}
        />
      ))}
    </div>
  );
}
