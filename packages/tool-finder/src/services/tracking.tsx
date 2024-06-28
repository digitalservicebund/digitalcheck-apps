import type { Reason } from "src/models/Reason";
import type { Ressort } from "src/models/Ressort";
import type { VisualisationObject } from "src/models/VisualisationObject";

const EVENT_BUTTON_CLICK = "Button: Click";
const EVENT_FEEDBACK_CLICK = "Feedback: Click";
const EVENT_SELECTION_SUBMIT = "Selection: Submit";

export function trackButtonClick(
  id: string | undefined,
  href: string | undefined,
) {
  window.plausible(EVENT_BUTTON_CLICK, {
    props: {
      id: id ?? "",
      href: href ?? "",
    },
  });
}

const combine = (...values: string[]) => {
  return values.join(" --- ");
};

export function trackSelection(
  ressort: Ressort | null,
  object: VisualisationObject | null,
  reason: Reason | null,
) {
  if (!ressort || !object || !reason) {
    return;
  }

  const ressortName = ressort.name;
  const objectName = object.name;
  const reasonName = reason.name;

  window.plausible(EVENT_SELECTION_SUBMIT, {
    props: {
      ressort: ressortName,
      object: objectName,
      reason: reasonName,
      ressortAndObject: combine(ressortName, objectName),
      ressortAndReason: combine(ressortName, reasonName),
      objectAndReason: combine(objectName, reasonName),
      ressortAndObjectAndReason: combine(ressortName, objectName, reasonName),
    },
  });
}

export function trackFeedbackClick(
  question: string,
  value: number,
  ressort: string,
  object: string,
  reason: string,
) {
  const valueString = value.toString();
  window.plausible(EVENT_FEEDBACK_CLICK, {
    props: {
      questionAndValue: combine(question, valueString),
      questionAndValueForSelection: combine(
        ressort,
        object,
        reason,
        question,
        valueString,
      ),
    },
  });
}
