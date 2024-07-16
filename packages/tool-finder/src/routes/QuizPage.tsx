import Background from "@digitalcheck/shared/components/Background";
import BetaBanner from "@digitalcheck/shared/components/BetaBanner";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import Question from "@digitalcheck/shared/components/Question";
import { RadioOptionsProps } from "@digitalcheck/shared/components/RadioGroup";
import { SelectOptionsProps } from "@digitalcheck/shared/components/Select";
import { useForm } from "@rvf/react";
import { withZod } from "@rvf/zod";
import type { Entity } from "models/Entity";
import type { Reason } from "models/Reason";
import type { Ressort } from "models/Ressort";
import type { VisualisationObject } from "models/VisualisationObject";
import {
  getAllObjects,
  getAllReasons,
  getAllRessorts,
} from "persistance/repository";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router";
import { trackSelection } from "services/tracking";
import useTitle from "services/useTitle";
import { z } from "zod";
import { PATH_RESULT } from ".";

export type QuizPageProps = {
  ressort: Ressort | null;
  setRessort: Dispatch<SetStateAction<Ressort | null>>;
  object: VisualisationObject | null;
  setObject: Dispatch<SetStateAction<VisualisationObject | null>>;
  reason: Reason | null;
  setReason: Dispatch<SetStateAction<Reason | null>>;
};

function mapToSelectOptions(entities: readonly Entity[]): SelectOptionsProps {
  return entities.map((entity) => {
    return {
      value: entity.id,
      text: entity.name,
    };
  });
}

function mapToRadioOptions<Type extends VisualisationObject | Reason>(
  entities: readonly Type[],
): RadioOptionsProps {
  return entities.map((entity) => {
    const option = {
      value: entity.id,
      text: entity.name,
    };
    if (entity.description) {
      return {
        ...option,
        subText: entity.description,
      };
    }
    return option;
  });
}

function onChangeHandler<Type extends Entity>(
  selectedEntityId: string,
  setEntity: Dispatch<SetStateAction<Type | null>>,
  allEntities: readonly Type[],
) {
  const selectedEntity = allEntities.find((e) => e.id === selectedEntityId);
  setEntity(selectedEntity ?? null);
}

const validator = withZod(
  z.object({
    ressort: z
      .string()
      .min(1, { message: "Bitte wählen Sie ein Ressort aus." }),
    object: z.string({
      required_error: "Bitte wählen Sie eine Visualisierung aus.",
    }),
    reason: z.string({ required_error: "Bitte wählen Sie einen Grund aus." }),
  }),
);

function QuizPage({
  ressort,
  setRessort,
  object,
  setObject,
  reason,
  setReason,
}: Readonly<QuizPageProps>) {
  useTitle("Werkzeugfinder für Visualisierungen");
  const navigate = useNavigate();
  const form = useForm({
    validator,
    handleSubmit: () => {
      trackSelection(ressort, object, reason);
      navigate(PATH_RESULT);
    },
  });

  const ressorts = getAllRessorts();
  const objects = getAllObjects();
  const reasons = getAllReasons();

  return (
    <>
      <Background backgroundColor="blue" paddingTop="48" paddingBottom="48">
        <Container paddingTop="0" paddingBottom="0">
          <Header
            heading={{
              tagName: "h1",
              text: "Werkzeugfinder für Visualisierungen",
            }}
            content={{
              markdown: `Beantworten Sie uns drei Fragen und wir schlagen Ihnen das für Ihren Anlass passende Werkzeug vor.`,
            }}
          ></Header>
        </Container>
      </Background>
      <BetaBanner />
      <div className="pt-80 max-w-2xl m-auto">
        <form {...form.getFormProps()}>
          <Question
            box={{
              label: {
                text: "1 von 3",
              },
              heading: {
                text: "In welchem Ressort arbeiten Sie?",
              },
              content: {
                markdown:
                  "Diese Information benötigen wir, um in Ihrem Haus verfügbare Werkzeuge zu finden.",
              },
            }}
            select={{
              name: "ressort",
              label: "Ressort",
              value: ressort?.id,
              onChange: (e: ChangeEvent<HTMLSelectElement>) =>
                onChangeHandler(e.target.value, setRessort, ressorts),
              options: mapToSelectOptions(ressorts),
              error: form.error("ressort"),
            }}
          />
          <Question
            box={{
              label: {
                text: "2 von 3",
              },
              heading: {
                text: "Was möchten Sie darstellen?",
              },
              content: {
                markdown:
                  "Die Art der Darstellung gibt vor, welches Werkzeug am besten passt.",
              },
            }}
            radio={{
              name: "object",
              selectedValue: object?.id,
              onChange: (e: ChangeEvent<HTMLInputElement>) =>
                onChangeHandler(e.target.value, setObject, objects),
              options: mapToRadioOptions(objects),
              error: form.error("object"),
            }}
          />
          <Question
            box={{
              label: {
                text: "3 von 3",
              },
              heading: {
                text: "Wofür möchten Sie die Visualisierung erstellen?",
              },
              content: {
                markdown:
                  "Bei mehreren Gründen nennen Sie uns den wichtigsten.",
              },
            }}
            radio={{
              name: "reason",
              selectedValue: reason?.id,
              onChange: (e: ChangeEvent<HTMLInputElement>) =>
                onChangeHandler(e.target.value, setReason, reasons),
              options: mapToRadioOptions(reasons),
              error: form.error("reason"),
            }}
          />
          <Container paddingTop="0" paddingBottom="80">
            <ButtonContainer>
              <Button
                id="quiz-find-tool"
                text="Werkzeug suchen"
                size="large"
                type="submit"
              />
            </ButtonContainer>
          </Container>
        </form>
      </div>
    </>
  );
}

export default QuizPage;
