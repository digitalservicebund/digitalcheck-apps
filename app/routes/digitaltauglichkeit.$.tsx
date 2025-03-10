import { LoaderFunctionArgs, redirect } from "react-router";

export function loader({ request }: LoaderFunctionArgs) {
  // Redirect all requests to /digitaltauglichkeit/... to /beispiele/...
  const url = new URL(request.url);
  return redirect(
    url.pathname.replace("/digitaltauglichkeit", "/beispiele"),
    301,
  );
}
