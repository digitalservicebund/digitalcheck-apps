import Image from "@digitalcheck/shared/components/Image";
import bundLogo from "@digitalcheck/shared/public/img/bund-logo.png";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="px-16 py-20">
      <Link
        to="/"
        className="ds-label-01-bold no-underline hover:underline focus:outline active:underline"
        aria-label="Werkzeugfinder - Zurück zur Startseite"
      >
        <Image
          url={bundLogo}
          width={54}
          alternativeText="Logo des Bundesministerium des Innern und für Heimat"
        />
      </Link>
    </header>
  );
}
