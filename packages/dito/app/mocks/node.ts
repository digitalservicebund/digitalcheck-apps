import unleashHandlers from "mocks/unleashHandlers";
import { setupServer } from "msw/node";

export const mockServer = setupServer(...unleashHandlers);
