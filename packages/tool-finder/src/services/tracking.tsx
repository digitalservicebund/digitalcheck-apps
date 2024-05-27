import SharedTracking from "@digitalcheck/shared/services/sharedTracking.tsx";
import type { Reason } from "models/Reason";
import type { Ressort } from "models/Ressort";
import type { VisualisationObject } from "models/VisualisationObject";
import Plausible from "plausible-tracker";

const EVENT_BUTTON_CLICK = "Button: Click";
const EVENT_FEEDBACK_CLICK = "Feedback: Click";
const EVENT_SELECTION_SUBMIT = "Selection: Submit";

class TrackingService implements SharedTracking {
  plausible = Plausible({
    domain: "visualisieren.digitalcheck.bund.de",
    hashMode: true,
  });

  constructor() {
    this.plausible.enableAutoPageviews();
    this.plausible.enableAutoOutboundTracking();
  }

  trackButtonClick(id: string | undefined, href: string | undefined) {
    this.plausible.trackEvent(EVENT_BUTTON_CLICK, {
      props: {
        id: id ?? "",
        href: href ?? "",
      },
    });
  }

  combine = (...values: string[]) => {
    return values.join(" --- ");
  };

  trackSelection(
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

    this.plausible.trackEvent(EVENT_SELECTION_SUBMIT, {
      props: {
        ressort: ressortName,
        object: objectName,
        reason: reasonName,
        ressortAndObject: this.combine(ressortName, objectName),
        ressortAndReason: this.combine(ressortName, reasonName),
        objectAndReason: this.combine(objectName, reasonName),
        ressortAndObjectAndReason: this.combine(
          ressortName,
          objectName,
          reasonName,
        ),
      },
    });
  }

  trackFeedbackClick(
    question: string,
    value: number,
    ressort: string,
    object: string,
    reason: string,
  ) {
    const valueString = value.toString();
    this.plausible.trackEvent(EVENT_FEEDBACK_CLICK, {
      props: {
        questionAndValue: this.combine(question, valueString),
        questionAndValueForSelection: this.combine(
          ressort,
          object,
          reason,
          question,
          valueString,
        ),
      },
    });
  }
}

const tracking: TrackingService = new TrackingService();
export default tracking;
