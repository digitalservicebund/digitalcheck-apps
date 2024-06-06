import Background from "@digitalcheck/shared/components/Background";
import BetaBanner from "@digitalcheck/shared/components/BetaBanner";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import Question from "@digitalcheck/shared/components/Question";
import { RadioOptionsProps } from "@digitalcheck/shared/components/RadioGroup";
import { SelectOptionsProps } from "@digitalcheck/shared/components/Select";
import type { Entity } from "models/Entity";
import type { Reason } from "models/Reason";
import type { Ressort } from "models/Ressort";
import type { VisualisationObject } from "models/VisualisationObject";
import {
  getAllObjects,
  getAllReasons,
  getAllRessorts,
} from "persistance/repository";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { trackSelection } from "services/tracking";
import useTitle from "services/useTitle";
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  }: UseFormReturn = useForm();

  const ressorts = getAllRessorts();
  const objects = getAllObjects();
  const reasons = getAllReasons();

  const onChangeRessort = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeHandler(e.target.value, setRessort, ressorts);
  };
  const onChangeObject = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeHandler(e.target.value, setObject, objects);
  };
  const onChangeReason = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeHandler(e.target.value, setReason, reasons);
  };

  const onSubmit = () => {
    trackSelection(ressort, object, reason);
    navigate(PATH_RESULT);
  };

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
      <div className={"pt-80 max-w-2xl m-auto"}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              onChange: onChangeRessort,
              options: mapToSelectOptions(ressorts),
              formRegister: register,
              error: errors["ressort"],
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
              onChange: onChangeObject,
              options: mapToRadioOptions(objects),
              formRegister: register,
              error: errors["object"],
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
              onChange: onChangeReason,
              options: mapToRadioOptions(reasons),
              formRegister: register,
              error: errors["reason"],
            }}
          />
          <Container paddingTop="0" paddingBottom="80">
            <ButtonContainer>
              <Button
                id={"quiz-find-tool"}
                text={"Werkzeug suchen"}
                size={"large"}
                type={"submit"}
              />
            </ButtonContainer>
          </Container>
        </form>
      </div>
    </>
  );
}

export default QuizPage;
