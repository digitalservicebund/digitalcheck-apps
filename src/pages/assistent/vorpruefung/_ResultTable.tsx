import {
  assistent_vorpruefung_automatisierung,
  assistent_vorpruefung_datenaustausch,
  assistent_vorpruefung_euBezug,
  assistent_vorpruefung_itSystem,
  assistent_vorpruefung_kommunikation,
  assistent_vorpruefung_verpflichtungenFuerBeteiligte,
  type Route,
} from "@/config/routes";
import { wizardStores } from "@/wizard/stores";
import {
  answerOptions,
  vorpruefungFields,
  type Answer,
  type VorpruefungField,
} from "@/wizard/vorpruefungSchema";
import { useStore } from "@nanostores/react";

const answerLabels = Object.fromEntries(
  answerOptions.map(({ value, label }) => [value, label]),
) as Record<Answer, string>;

const noDigitalReference = "Kein Digitalbezug aus dieser Frage.";
const unsure = "Noch offen – prüfen Sie diese Antwort.";

// Title and path come from the question page, the explanations per answer
// describe its effect on the result.
const rows = {
  "it-system": {
    route: assistent_vorpruefung_itSystem,
    explanations: {
      yes: "Neues oder angepasstes IT-System – direkter Digitalbezug.",
      no: noDigitalReference,
      unsure,
    },
  },
  "verpflichtungen-fuer-beteiligte": {
    route: assistent_vorpruefung_verpflichtungenFuerBeteiligte,
    explanations: {
      yes: "Mitwirkungspflichten sollten digital erfüllbar sein.",
      no: noDigitalReference,
      unsure,
    },
  },
  datenaustausch: {
    route: assistent_vorpruefung_datenaustausch,
    explanations: {
      yes: "Datenwiederverwendung braucht digitale Schnittstellen.",
      no: noDigitalReference,
      unsure,
    },
  },
  kommunikation: {
    route: assistent_vorpruefung_kommunikation,
    explanations: {
      yes: "Interaktion mit Behörden sollte digital möglich sein.",
      no: noDigitalReference,
      unsure,
    },
  },
  automatisierung: {
    route: assistent_vorpruefung_automatisierung,
    explanations: {
      yes: "Schritte der Umsetzung lassen sich digital automatisieren.",
      no: noDigitalReference,
      unsure,
    },
  },
  "eu-bezug": {
    route: assistent_vorpruefung_euBezug,
    explanations: {
      yes: "Löst die Anforderungen der Verordnung (EU) 2024/903 aus.",
      no: "Keine Anforderungen aus der Verordnung (EU) 2024/903.",
      unsure,
    },
  },
} as const satisfies Record<
  VorpruefungField,
  { route: Route; explanations: Record<Answer, string> }
>;

// Same order as the questions in the flow
const fieldNames = Object.keys(vorpruefungFields) as VorpruefungField[];

/** Lists every answer with its effect on the result and a link to change it */
export default function ResultTable() {
  // Empty during hydration, matching the HTML from the build, then the stored data
  const data: Partial<Record<string, Answer>> = useStore(
    wizardStores.vorpruefung.$data,
    { ssr: () => ({}) },
  );

  return (
    <div className="kern-table-responsive">
      <table className="kern-table">
        <thead className="kern-table__head sr-only">
          <tr className="kern-table__row">
            <th className="kern-table__header" scope="col">
              Frage
            </th>
            <th className="kern-table__header" scope="col">
              Antwort
            </th>
            <th className="kern-table__header" scope="col">
              Auswirkung
            </th>
            <th
              className="kern-table__header kern-table__header--action"
              scope="col"
            >
              Aktion
            </th>
          </tr>
        </thead>
        <tbody className="kern-table__body">
          {fieldNames.map((name) => {
            const { route, explanations } = rows[name];
            const answer = data[name];
            return (
              <tr key={name} className="kern-table__row">
                <th className="kern-table__header" scope="row">
                  {route.title}
                </th>
                <td className="kern-table__cell">
                  {answer ? answerLabels[answer] : "–"}
                </td>
                <td className="kern-table__cell">
                  {answer ? explanations[answer] : "Noch nicht beantwortet."}
                </td>
                <td className="kern-table__cell kern-table__cell--action">
                  <a href={route.path} className="kern-link">
                    <span
                      className="kern-icon kern-icon--edit"
                      aria-hidden="true"
                    />
                    Bearbeiten<span className="sr-only">: {route.title}</span>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
