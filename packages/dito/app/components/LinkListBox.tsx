import Heading from "@digitalcheck/shared/components/Heading";
import { Link } from "@remix-run/react";
import { general } from "resources/content";

export type LinkItem = {
  id: string;
  title: string;
};

export default function LinkListBox({
  items,
}: Readonly<{ items: LinkItem[] }>) {
  return (
    <div className="mt-64">
      <Heading
        tagName="div"
        text={general.tableOfContents.headline}
        className="font-bold"
      />
      <ol className="list-unstyled ds-stack-8 mt-16">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={`#${item.id}`}
              className="underline decoration-1 underline-offset-4"
            >
              ↓ {item.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
