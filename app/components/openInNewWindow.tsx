import OpenInNewIcon from "@digitalservicebund/icons/OpenInNew";
import ReactDOMServer from "react-dom/server";

export const openInNewIconString = ReactDOMServer.renderToString(
  <OpenInNewIcon
    height="1.2em"
    width="1.2em"
    className="mb-4 ml-[0.2em] !inline-block fill-current"
  />,
);
