import Button from "@digitalcheck/shared/components/Button";
import RichText from "@digitalcheck/shared/components/RichText";

type NumberedListProps = {
  listItems: {
    title: string;
    text: string;
    link?: {
      text: string;
      url: string;
    };
  }[];
  title?: string;
};

export default function NumberedList({
  listItems,
  title,
}: Readonly<NumberedListProps>) {
  return (
    <div className="numbered-list ds-stack-32">
      {title && <h2>{title}</h2>}
      <ol className="list-none list-outside ds-stack-32 marker:border-2 marker:border-blue-600">
        {listItems.map((item, index) => (
          <li key={item.title} className="flex space-x-16">
            <div className="border border-gray-400 rounded-full w-40 h-40 flex justify-center items-center">
              {index + 1}
            </div>
            <div className="ds-stack-8 items-start">
              <h3 className="ds-heading-03-reg">{item.title}</h3>
              <RichText markdown={item.text} />
              {item.link && (
                <Button href={item.link.url}>{item.link.text}</Button>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
