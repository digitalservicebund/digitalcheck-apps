import { redirect } from "react-router";
import type { Route } from "./+types/digitaltauglichkeit.$";

export function loader({ request }: Route.LoaderArgs) {
  // Redirect all requests to /digitaltauglichkeit/... to /beispiele/...
  const url = new URL(request.url);
  return redirect(
    url.pathname.replace("/digitaltauglichkeit", "/beispiele"),
    301,
  );
}
