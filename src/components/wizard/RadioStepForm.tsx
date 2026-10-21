import type { Option } from "@/components/RadioGroup";
import RadioGroup from "@/components/RadioGroup";
import {
  getFieldSchema,
  getWizardSession,
  readUserData,
  type WizardId,
} from "@/wizard/session";
import { useForm } from "@rvf/react";
import { z } from "zod";

type RadioStepFormProps = {
  /** Referenced by the "Weiter" button in the WizardButtonBar outside of the island */
  formId: string;
  /** id of the heading that labels the radio group */
  labelledBy: string;
  options: readonly Option<string>[];
  wizardId: WizardId;
  /** Field name in the wizard's schema, e.g. the question id. Its schema validates the answer. */
  name: string;
};

// No data storage yet: a valid answer only decides where to navigate next.
export default function RadioStepForm({
  formId,
  labelledBy,
  options,
  wizardId,
  name,
}: Readonly<RadioStepFormProps>) {
  const form = useForm({
    // set via RVF, which also links the inputs to this id
    id: formId,
    schema: z.object({ [name]: getFieldSchema(wizardId, name) }),
    defaultValues: { [name]: "" },
    handleSubmit: (data) => {
      const session = getWizardSession(
        wizardId,
        globalThis.location.pathname,
        readUserData(wizardId),
      );
      // Include the new answer, guards (e.g. for the result page) may depend on it
      const nextPath = session.nextPath(data);
      if (nextPath) globalThis.location.href = nextPath;
    },
  });

  return (
    <form {...form.getFormProps()}>
      <RadioGroup
        scope={form.scope(name)}
        options={options}
        aria-labelledby={labelledBy}
      />
    </form>
  );
}
