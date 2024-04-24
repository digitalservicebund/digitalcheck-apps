import Plausible from "plausible-tracker";
import type { Reason } from "../models/Reason";
import type { Ressort } from "../models/Ressort";
import type { VisualisationObject } from "../models/VisualisationObject";

const EVENT_BUTTON_CLICK = "Button: Click";
const EVENT_FEEDBACK_CLICK = "Feedback: Click";
const EVENT_SELECTION_SUBMIT = "Selection: Submit";

const { enableAutoPageviews, enableAutoOutboundTracking, trackEvent } =
  Plausible({
    domain: "visualisieren.digitalcheck.bund.de",
    hashMode: true,
  });

export function enableTracking() {
  enableAutoPageviews();
  enableAutoOutboundTracking();
}

export function trackButtonClick(
  id: string | undefined,
  href: string | undefined,
) {
  trackEvent(EVENT_BUTTON_CLICK, {
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

  trackEvent(EVENT_SELECTION_SUBMIT, {
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
  trackEvent(EVENT_FEEDBACK_CLICK, {
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
