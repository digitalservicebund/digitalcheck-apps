import { Ressort } from "../../src/models/Ressort";
import { VisualisationObject } from "../../src/models/VisualisationObject";
import {
  findResultByObjectAndRessort,
  getAllObjects,
  getAllRessorts,
} from "../../src/persistance/repository";

describe("Repository", () => {
  test.each(createTestCases())(
    'findResultByObjectAndRessort for "%s" and "%s" returns two or three recommended tools.',
    (
      ressortName, // used for test name
      objectName, // used for test name
      ressort: Ressort,
      object: VisualisationObject,
    ) => {
      const result = findResultByObjectAndRessort(object, ressort);

      const ressortsWithoutFlussdiagrammPro = [
        "aa",
        "bmvg",
        "bmel",
        "bmuv",
        "bmwsb",
      ];

      expect(result.recommendations).not.toBeNull();
      if (
        result.cluster.id === "schaubild" ||
        (result.cluster.id === "flussdiagramm" &&
          ressortsWithoutFlussdiagrammPro.includes(ressort.id))
      ) {
        expect(result.recommendations.length).toBe(2);
      } else {
        expect(result.recommendations.length).toBe(3);
      }
    },
  );
});

function createTestCases() {
  return getAllRessorts().flatMap((ressort) =>
    getAllObjects().map(
      (object) => [ressort.name, object.name, ressort, object] as const,
    ),
  );
}
