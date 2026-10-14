import Badge from "@/components/Badge.tsx";
import Button from "@/components/Button";
import Combobox from "@/components/ComboBox.tsx";
import HelpButton from "@/components/HelpButton.tsx";
import Input from "@/components/Input";
import RichText from "@/components/RichText";
import Textarea from "@/components/Textarea.tsx";
import { useSyncedForm } from "@/routes/dokumentation/documentationDataHook.ts";
import { useDocumentationDataService } from "@/routes/dokumentation/DocumentationDataProvider.tsx";
import {
  type BindingRequirementsData,
  bindingRequirementsSchema,
} from "@/routes/dokumentation/documentationDataSchema.ts";
import {
  linkToIEAArticle,
  markdownLinkIEA,
} from "@/routes/dokumentation/interoperability/markdownLinkIEA.tsx";
import {
  serviceAreaOptions,
  stakeholderOptions,
} from "@/routes/dokumentation/interoperability/values.ts";
import { dedent } from "@/utils/dedentMultilineStrings";
import { DeleteOutlineTwoTone } from "@digitalservicebund/icons";
import { useFieldArray } from "@rvf/react";
import type React from "react";

type SectionNode = {
  id: string;
  isEnabled: () => boolean;
  render: () => React.ReactNode;
};

const defaultRequirementValue: BindingRequirementsData["requirements"][number] =
  {
    description: "",
    legalReference: "",
    services: undefined,
    stakeholderGroups: [],
    serviceAreas: [],
  };

export default function BindingRequirementsForm({
  nextUrl,
}: Readonly<{ nextUrl?: string }>) {
  const { setBindingRequirementsData, documentationData } =
    useDocumentationDataService();

  const storedData = documentationData?.bindingRequirements;

  const form = useSyncedForm({
    schema: bindingRequirementsSchema,
    defaultValues: {
      functions: [],
      requirements: [defaultRequirementValue],
    },
    setDataCallback: (data) =>
      setBindingRequirementsData(
        data ? bindingRequirementsSchema.parse(data) : undefined,
      ), // apply the .default([]) values set in the schema
    storedData,
    nextUrl,
  });

  const requirements = useFieldArray(form.scope("requirements"));
  const requirementCount = form.value("requirements")?.length ?? 0;

  const tree: SectionNode[] = [
    {
      id: "intro",
      isEnabled: () => true,
      render: () => (
        <>
          <p>
            In diesem Schritt wird gefragt, welche verbindlichen Anforderungen,
            d. h. Festlegungen im Sinne von{" "}
            {/* eslint-disable-next-line react/jsx-no-target-blank */}
            <a
              href={linkToIEAArticle({ article: 2 })}
              target="_blank"
              rel="noopener"
            >
              Art. 2 Nr. 15 der Verordnung (EU) 2024/903
            </a>
            {", "}
            von Ihrer Regelung betroffen sind.
            <HelpButton
              sectionId={"verbindliche-anforderungen"}
              title={"Was ist eine verbindliche Anforderung?"}
            >
              <RichText
                markdown={dedent`
                  Verbindliche Anforderungen können Vorgaben z. B. durch Gesetze oder Verordnungen sein. Der Begriff schließt aber auch Verträge oder Ausschreibungen ein.
                  Entscheidend ist außerdem die Frage, ob die Vorgabe festschreibt, wie Daten zwischen Systemen verschiedener EU-Länder fließen.
                  
                  Siehe ${markdownLinkIEA({ article: 2, paragraph: 15, format: "long" })}.
            `}
              />
            </HelpButton>
          </p>
          <p>
            Geben Sie außerdem an, auf welche grenzüberschreitenden digitalen
            Verwaltungsdienste sich diese Anforderungen auswirken. Dies betrifft
            sowohl von der Regelung benannte Dienste als auch den Vollzug.
            <HelpButton
              sectionId={"transeuropean_services"}
              title={
                "Was sind grenzüberschreitende digitale Verwaltungsdienste?"
              }
            >
              <RichText
                markdown={dedent`
                          Die Verordnung spricht wörtlich von "transeuropäischen digitalen öffentlichen Diensten".
                          Gemeint sind digitale Dienste und IT-Systeme, bei denen Daten zwischen Verwaltungen von
                          EU-Mitgliedstaaten ausgetauscht werden.
                          
                          Das können grenzüberschreitende Registerabfragen oder Meldungen sein. Die Verordnung nennt folgende Beispiele:
                          - Gegenseitige Anerkennung akademischer Diplome oder Berufsqualifikationen
                          - Austausch von Fahrzeugdaten für die Verkehrssicherheit
                          - Zugang zu Sozialversicherungs- und Gesundheitsdaten – darunter Pandemie- und Impfbescheinigungen
                          - Informationsaustausch in Bezug auf Steuern, Zölle, Vergabe öffentlicher Aufträge
                          - Digitale Führerscheine
                          - Handelsregister
                          
                          Siehe ${markdownLinkIEA({ recital: 6, format: "short" })}.
                          
                          **Was ist hier zu dokumentieren?**
                          
                          *Bevor* Sie neue oder wesentlich veränderte verbindliche Anforderungen festschreiben, die das Design, die Beschaffung, die Entwicklung oder die Implementierung solcher digitalen transeuropäischen Dienste betreffen, müssen Sie deren Auswirkungen auf die Interoperabilität bewerten.
                        `}
              />
            </HelpButton>
          </p>
        </>
      ),
    },
    {
      id: "bindingRequirements",
      isEnabled: () => true,
      render: () => (
        <div className="space-y-24">
          <h2 className="kern-heading-medium">
            In der Regelung enthaltene verbindliche{" "}
            <span className="text-nowrap">
              Anforderungen
              <HelpButton
                sectionId={"verbindliche-anforderungen"}
                title={"Was ist eine verbindliche Anforderung?"}
              ></HelpButton>
            </span>
          </h2>

          <div
            className="space-y-32"
            aria-live="polite"
            aria-relevant="additions removals"
          >
            {requirements.map((key, requirement, index) => {
              return (
                <div
                  className="space-y-16 rounded border p-16"
                  key={key}
                  data-testid={"requirement-" + index}
                >
                  <div className={"flex w-full justify-between"}>
                    <Badge look={"hint"}>Anforderung {index + 1}</Badge>

                    {requirementCount > 1 && (
                      <Button
                        look="link"
                        aria-label={`Anforderung ${index + 1} entfernen`}
                        onClick={async () => {
                          await requirements.remove(index);
                        }}
                        type={"button"}
                      >
                        <DeleteOutlineTwoTone />
                      </Button>
                    )}
                  </div>
                  <Input
                    scope={requirement.scope("description")}
                    placeholder={
                      "z. B. Übermittlung von Berichten an EU-Behörde"
                    }
                  >
                    Kurzbeschreibung oder Titel
                  </Input>
                  <Input
                    placeholder={"z. B. § 6"}
                    scope={requirement.scope("legalReference")}
                  >
                    Rechtsgrundlage für die verbindliche Anforderung
                  </Input>
                  <div className="space-y-24">
                    <Textarea
                      scope={requirement.scope("services")}
                      description="Abkürzungen bitte ausschreiben."
                    >
                      Betroffene grenzüberschreitende digitale
                      Verwaltungsdienste
                      <HelpButton
                        sectionId={"transeuropean_services"}
                        title={"Was sind digitale transeuropäische Dienste?"}
                      ></HelpButton>
                    </Textarea>

                    <Combobox
                      options={serviceAreaOptions}
                      scope={requirement.scope("serviceAreas")}
                    >
                      Für welche Bereiche sind diese Dienste relevant?
                    </Combobox>

                    <Combobox
                      options={stakeholderOptions}
                      scope={requirement.scope("stakeholderGroups")}
                    >
                      Für wen gilt diese verbindliche Anforderung?
                    </Combobox>
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            type="button"
            look="ghost"
            iconLeft="kern-icon--add"
            onClick={async () => {
              await requirements.push(defaultRequirementValue);
            }}
          >
            Verbindliche Anforderung hinzufügen
          </Button>
        </div>
      ),
    },
  ];
  return (
    <form className="space-y-32" {...form.getFormProps()}>
      {tree
        .filter((section) => section.isEnabled())
        .map((section) => (
          <section key={section.id} className="space-y-12">
            {section.render()}
          </section>
        ))}
    </form>
  );
}
