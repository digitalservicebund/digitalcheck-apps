import type { Option } from "@/components/RadioGroup";
import RadioGroup from "@/components/RadioGroup";
import { getFieldSchema, type WizardId } from "@/wizard/session";
import { wizardStores } from "@/wizard/stores";
import { useStore } from "@nanostores/react";
import { useForm } from "@rvf/react";
import { useEffect } from "react";
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

export default function RadioStepForm({
  formId,
  labelledBy,
  options,
  wizardId,
  name,
}: Readonly<RadioStepFormProps>) {
  const { $data, $session, save } = wizardStores[wizardId];
  // Empty during hydration, matching the HTML from the build, then the stored data
  const data: Record<string, unknown> = useStore($data, { ssr: () => ({}) });
  const storedAnswer = data[name];
  const defaultValues: Record<string, string> = { [name]: "" };

  const form = useForm({
    // set via RVF, which also links the inputs to this id
    id: formId,
    schema: z.object({ [name]: getFieldSchema(wizardId, name) }),
    defaultValues,
    handleSubmit: (values) => {
      save(values);
      // The session already includes the saved answer, guards may depend on it
      const nextPath = $session.get()?.nextPath();
      if (nextPath) globalThis.location.href = nextPath;
    },
  });

  // Pre-fill once the stored answer is known (after hydration or from another tab)
  useEffect(() => {
    if (typeof storedAnswer === "string")
      form.resetForm({ [name]: storedAnswer });
  }, [form, name, storedAnswer]);

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
