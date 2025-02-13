import plausibleHandlers from "mocks/stubs/plausibleHandlers";
import unleashHandlers from "mocks/unleashHandlers";
import { setupServer } from "msw/node";

export const mockServer = setupServer(...unleashHandlers, ...plausibleHandlers);
