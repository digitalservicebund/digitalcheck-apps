import exampleFeaturesResponse from "mocks/stubs/unleash/features.json";
import { http, HttpResponse, RequestHandler } from "msw";
import { features } from "resources/features";
import { UNLEASH_API_URL } from "utils/constants";

const unleashHandlers: RequestHandler[] = [
  http.get(`${UNLEASH_API_URL}client/features`, () => {
    const response = { ...exampleFeaturesResponse };
    const exampleFeature = { ...response.features[0] };
    for (const featureName of Object.values(features)) {
      const feature = { ...exampleFeature };
      feature.name = featureName;
      feature.enabled = true;
      response.features.push(feature);
    }
    return HttpResponse.json(response);
  }),
];

export default unleashHandlers;
