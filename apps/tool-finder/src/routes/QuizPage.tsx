import Background from "../components/Background";
import Button from "../components/Button";
import ButtonContainer from "../components/ButtonContainer";
import Container from "../components/Container";
import Header from "../components/Header";
import useTitle from "../services/useTitle";

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import BetaBanner from "../components/BetaBanner";
import Question from "../components/Question";
import { RadioOptionsProps } from "../components/RadioGroup";
import { SelectOptionsProps } from "../components/Select";
import type { Entity } from "../models/Entity";
import type { Reason } from "../models/Reason";
import type { Ressort } from "../models/Ressort";
import type { VisualisationObject } from "../models/VisualisationObject";
import {
  getAllObjects,
  getAllReasons,
  getAllRessorts,
} from "../persistance/repository";
import { trackSelection } from "../services/tracking";
import { PATH_RESULT } from "./";

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
}: QuizPageProps) {
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
            heading={"In welchem Ressort arbeiten Sie?"}
            label={"1 von 3"}
            description={`Diese Information benötigen wir, um in Ihrem Haus verfügbare Werkzeuge zu finden.`}
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
            heading={"Was möchten Sie darstellen?"}
            label={"2 von 3"}
            description={`Die Art der Darstellung gibt vor, welches Werkzeug am besten passt.`}
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
            heading={"Wofür möchten Sie die Visualisierung erstellen?"}
            label={"3 von 3"}
            description={`Bei mehreren Gründen nennen Sie uns den wichtigsten.`}
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
                text={"Werkzeug suchen"}
                size={"large"}
                id={"quiz-find-tool"}
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
