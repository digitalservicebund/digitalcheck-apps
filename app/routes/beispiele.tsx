import { Outlet, useLoaderData } from "react-router";
import SupportBanner from "~/components/SupportBanner";

import {
  fetchStrapiData,
  GET_PRINZIPS_QUERY,
  Prinzip,
} from "~/utils/strapiData.server";

export async function loader() {
  const prinzipData = await fetchStrapiData<{ prinzips: Prinzip[] }>(
    GET_PRINZIPS_QUERY,
  );

  if ("error" in prinzipData) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response(prinzipData.error, { status: 400 });
  }

  return prinzipData.prinzips.toSorted((a, b) => a.Nummer - b.Nummer);
}

export default function Digitaltauglichkeit() {
  return (
    <>
      <Outlet context={useLoaderData<typeof loader>()} />
      <SupportBanner />
    </>
  );
}
