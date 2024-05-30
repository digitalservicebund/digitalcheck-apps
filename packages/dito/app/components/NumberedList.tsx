import Box from "@digitalcheck/shared/components/Box";

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
            <div className="border border-gray-400 rounded-full w-40 h-40 flex-none flex justify-center items-center">
              {index + 1}
            </div>
            <Box
              heading={{ tagName: "h3", text: item.title }}
              content={{ markdown: item.text }}
              buttons={
                item.link && [
                  {
                    text: item.link.text,
                    href: item.link.url,
                  },
                ]
              }
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
