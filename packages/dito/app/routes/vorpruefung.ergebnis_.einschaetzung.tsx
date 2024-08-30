import Box from "@digitalcheck/shared/components/Box";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import Input from "@digitalcheck/shared/components/Input";
import { NumberedList } from "@digitalcheck/shared/components/List.tsx";
import Download from "@digitalservicebund/icons/Download";
import {
  json,
  MetaFunction,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { useEffect, useState } from "react";
import { assessment } from "resources/content";
import {
  ROUTE_ASSESSMENT,
  ROUTE_ASSESSMENT_PDF,
  ROUTE_RESULT,
} from "resources/staticRoutes";
import unleash from "utils/featureFlags.server";
import prependMetaTitle from "utils/metaTitle";
import { z } from "zod";
import { type action as TUniqAction } from "./uniq.($encrypted).($iv)";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_ASSESSMENT.title, matches);
};

const validator = withZod(
  z.object({
    title: z
      .string()
      .min(1, { message: assessment.form.policyTitleRequired })
      .max(500, { message: assessment.form.policyTitleTooLong }),
  }),
);

export function loader() {
  const quicksendNkrFlag = unleash.isEnabled("digitalcheck.quicksend-nkr");

  console.log({ quicksendNkrFlag });

  return json({ quicksendNkrFlag });
}

export default function Assessment() {
  const form = useForm({
    validator,
    method: "post",
    action: ROUTE_ASSESSMENT_PDF.url,
    reloadDocument: true,
  });
  const [downloadIsDisabled, setDownloadIsDisabled] = useState(false);
  const { quicksendNkrFlag } = useLoaderData<typeof loader>();
  const [uniqueUrl, setUniqueUrl] = useState("");
  const fetcher = useFetcher<typeof TUniqAction>();

  useEffect(() => {
    if (form.formState.isValid && form.formState.isSubmitting) {
      // disable download button for 2 seconds as we don't know when the PDF is ready
      setDownloadIsDisabled(true);
      const timeout = setTimeout(() => {
        form.resetForm();
        setDownloadIsDisabled(false);
      }, 2000);
      // reset downloadIsDisabled and clear timeout to handle submit without input
      return () => {
        setDownloadIsDisabled(false);
        clearTimeout(timeout);
      };
    }
  }, [form]);

  return (
    <>
      <Container paddingBottom="0">
        <Box
          heading={{
            tagName: "h1",
            text: assessment.title,
            look: "ds-heading-02-reg",
          }}
          content={{
            markdown: assessment.subtitle,
          }}
        ></Box>
      </Container>
      <Container paddingBottom="48">
        <form
          {...form.getFormProps()}
          onChange={
            quicksendNkrFlag
              ? (event) => {
                  fetcher.submit(event.currentTarget, {
                    action: "/uniq",
                    method: "POST",
                  });
                  if (fetcher.data) {
                    const { url } = fetcher.data;
                    setUniqueUrl(url);
                  }
                }
              : undefined
          }
        >
          <Input
            name="title"
            label={assessment.form.policyTitleLabel}
            error={form.error("title")}
          />
          {quicksendNkrFlag && (
            <p>
              <br />
              {uniqueUrl}
            </p>
          )}
          <br />
          <ButtonContainer
            buttons={[
              {
                id: "assessment-back-button",
                text: "Zurück",
                href: ROUTE_RESULT.url,
                look: "tertiary",
              },
              {
                id: "assessment-download-button",
                text: downloadIsDisabled
                  ? assessment.form.downloadStarted
                  : assessment.form.downloadPdfButton.text,
                type: "submit",
                look: "primary",
                iconLeft: <Download />,
                disabled: downloadIsDisabled,
              },
            ]}
          />
        </form>
      </Container>
      <Container>
        <NumberedList
          heading={{
            text: assessment.nextSteps.title,
            tagName: "h2",
          }}
          items={assessment.nextSteps.steps}
        />
      </Container>
    </>
  );
}
