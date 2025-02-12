import unleashHandlers from "mocks/unleashHandlers";
import { setupServer, type SetupServerApi } from "msw/node";

export const mockServer: SetupServerApi = setupServer(...unleashHandlers);
