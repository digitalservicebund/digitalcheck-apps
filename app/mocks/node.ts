import { setupServer } from "msw/node";
import plausibleHandlers from "~/mocks/plausibleHandlers";
import unleashHandlers from "~/mocks/unleashHandlers";

export const mockServer = setupServer(...unleashHandlers, ...plausibleHandlers);
