import OpenInNewIcon from "@digitalservicebund/icons/OpenInNew";
import { Link } from "react-router-dom";
import { A11Y_MESSAGE_NEW_WINDOW } from "./Aria";
import Container from "./Container";
import Image from "./Image";
import bmiLogo from "/logo/bmi-logo.png";

type LinkProps = {
  preText?: string;
  url: string;
  text: string;
  openInNewTab?: boolean;
};

type FooterProps = {
  links: LinkProps[];
};

export default function Footer({ links }: Readonly<FooterProps>) {
  const linksMiddleIndex = Math.ceil(links.length / 2);
  const linksFirstColumn: typeof links = links.slice(0, linksMiddleIndex);
  const linksSecondColumn: typeof links = links.slice(linksMiddleIndex);

  const renderLink = (link: LinkProps) => (
    <li key={link.url}>
      {link?.preText}{" "}
      <Link
        to={link.url}
        className="text-link increase-tap-area whitespace-nowrap"
        target={link.openInNewTab ? "_blank" : undefined}
        rel={link.openInNewTab ? "noreferrer" : undefined}
        aria-describedby={
          link.openInNewTab ? A11Y_MESSAGE_NEW_WINDOW : undefined
        }
      >
        {link.text}{" "}
        {link.openInNewTab && (
          <OpenInNewIcon
            height="1.2em"
            width="1.2em"
            className="mb-1 ml-[0.2em] !inline"
          />
        )}
      </Link>
    </li>
  );

  const renderLinks = (links: LinkProps[]) => (
    <ul className="list-unstyled ds-stack-16" key={links[0]?.url}>
      {links.map(renderLink)}
    </ul>
  );

  return (
    <footer
      className="w-full text-base leading-snug print:hidden"
      aria-label="Seitenfußbereich"
    >
      <Container className="sm:px-16">
        <div className="flex flex-wrap items-start justify-between gap-y-32">
          <div className="flex flex-col-reverse gap-16 sm:flex-row">
            <Image
              url={bmiLogo}
              width={120}
              alternativeText="Logo des Bundesministerium des Innern und für Heimat"
            />
            <div>
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
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-8">
            {renderLinks(linksFirstColumn)}
            {renderLinks(linksSecondColumn)}
          </div>
        </div>
      </Container>
    </footer>
  );
}
