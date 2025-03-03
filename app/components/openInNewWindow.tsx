import OpenInNewIcon from "@digitalservicebund/icons/OpenInNew";
import ReactDOMServer from "react-dom/server";

export const openInNewIconElement = (
  <OpenInNewIcon
    height="1.2em"
    width="1.2em"
    className="mb-4 ml-[0.2em] !inline-block fill-current"
  />
);

export const openInNewIconString =
  ReactDOMServer.renderToString(openInNewIconElement);
