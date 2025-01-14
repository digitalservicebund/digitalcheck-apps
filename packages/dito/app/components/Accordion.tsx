import AccordionItem, { AccordionItemProps } from "./AccordionItem";

export default function Accordion({
  items,
}: Readonly<{ items: AccordionItemProps[] }>) {
  return (
    <div className="accordion bg-white border-b-2 border-b-blue-800">
      {items.map((item) => (
        <AccordionItem
          key={item.headline}
          headline={item.headline}
          content={item.content}
          id={item.id}
        />
      ))}
    </div>
  );
}
