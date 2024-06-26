import bmiLogo from "public/img/bmi-logo.png";
import { Link } from "react-router-dom";
import { A11Y_MESSAGE_NEW_WINDOW } from "./Aria";
import Container from "./Container";
import Image from "./Image";

type LinkProps = {
  preText?: string;
  postText?: string;
  url: string;
  text: string;
  openInNewTab?: boolean;
};

export default function Footer({ links }: Readonly<{ links: LinkProps[] }>) {
  const linksMiddleIndex = Math.ceil(links.length / 2);
  const linksFirstColumn: typeof links = links.slice(0, linksMiddleIndex);
  const linksSecondColumn: typeof links = links.slice(linksMiddleIndex);

  const renderLink = (link: LinkProps) => (
    <li key={link.url}>
      {link?.preText}{" "}
      <Link
        to={link.url}
        className="text-link increase-tap-area"
        target={link.openInNewTab ? "_blank" : undefined}
        rel={link.openInNewTab ? "noreferrer" : undefined}
        aria-describedby={
          link.openInNewTab ? A11Y_MESSAGE_NEW_WINDOW : undefined
        }
      >
        {link.text}
      </Link>{" "}
      {link?.postText}
    </li>
  );

  const renderLinks = (links: LinkProps[]) => (
    <ul className="list-none m-0 p-0 ds-stack-8" key={links[0]?.url}>
      {links.map(renderLink)}
    </ul>
  );

  return (
    <footer className="text-base leading-snug">
      <Container paddingTop="48">
        <div className="flex flex-wrap items-start justify-between gap-y-32">
          <div className="flex flex-col flex-col-reverse sm:flex-row gap-y-8 gap-x-16">
            <div className="py-4 pr-4">
              <Image
                url={bmiLogo}
                width={120}
                alternativeText="Logo des Bundesministerium des Innern und für Heimat"
              />
            </div>
            {renderLinks([
              {
                preText: "Ein Onlinedienst der",
                text: "DigitalService GmbH des Bundes",
                url: "https://digitalservice.bund.de/",
                openInNewTab: true,
              },
              {
                preText: "Im Auftrag des",
                text: "Bundesministerium des Innern und für Heimat",
                url: "https://www.bmi.bund.de/",
                openInNewTab: true,
              },
            ])}
          </div>

          <div className="flex flex-wrap gap-x-32 gap-y-8">
            {renderLinks(linksFirstColumn)}
            {renderLinks(linksSecondColumn)}
          </div>
        </div>
      </Container>
    </footer>
  );
}
