import Button, { LinkButton } from "@/components/Button.tsx";
import ButtonContainer from "@/components/ButtonContainer.tsx";
import Heading from "@/components/Heading";
import RichText from "@/components/RichText.tsx";
import { general } from "@/resources/content/shared/general.ts";
import { useState } from "react";
import { useDocumentationNavigation } from "./dokumentation/DocumentationNavigationContext";

const notes = `
## Datenspeicherung

Ihre eingegebenen Daten werden **unbegrenzt lange** in der Sitzung gespeichert, bis

a) Sie eine neue Dokumentation starten, oder<br />
b) Ihr SINA-Rechner die Daten löscht (falls das bei Ihnen voreingestellt ist)

**Bitte beachten Sie:** Es ist jeweils nur die Bearbeitung einer Dokumentation möglich. Sie können den Vorgang unterbrechen und später fortsetzen. Der aktuelle Stand bleibt auch nach Schließen des Fensters erhalten.

## Zwischenspeicherung als Word-Dokument

Zur externen Weiterbearbeitung, internen Abstimmung oder für Änderungen können Sie den aktuellen Stand Ihrer Angaben als Word-Dokument exportieren und lokal speichern. Die finale Datei können Sie zu jedem Zeitpunkt per E-Mail an den NKR versenden.
`;

export function DocumentationHinweise() {
  const { nextUrl, previousUrl } = useDocumentationNavigation();
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <>
      <Heading
        text="Wichtige Hinweise"
        tagName="h1"
        look="kern-heading-large"
        className="mb-16"
      />
      <RichText
        className="[&>h2]:kern-heading-medium [&>h2]:mt-40"
        markdown={notes}
      />

      <div className="kern-form-check">
        <input
          id="datenspeicherung"
          name="datenspeicherung"
          type="checkbox"
          className="kern-form-check__checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label className="kern-label" htmlFor="datenspeicherung">
          Ich habe die oberen Hinweise gelesen.
        </label>
      </div>
      <ButtonContainer>
        <Button
          look={"primary"}
          disabled={!checked}
          type={"button"}
          onClick={() => (globalThis.location.href = nextUrl)}
        >
          Verstanden und weiter
        </Button>
        <LinkButton href={previousUrl} look="tertiary">
          {general.buttonBack.text}
        </LinkButton>
      </ButtonContainer>
    </>
  );
}
