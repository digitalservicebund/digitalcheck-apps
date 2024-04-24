import rawData from "../../resources/data";
import type { Data } from "../models/Data";
import type { Entity } from "../models/Entity";
import type { Reason } from "../models/Reason";
import type { Ressort } from "../models/Ressort";
import type { Result } from "../models/Result";
import type { VisualisationObject } from "../models/VisualisationObject";

const data: Data = rawData;

export function getAllRessorts() {
  return data.ressorts;
}

export function getAllObjects(): readonly VisualisationObject[] {
  return [...data.objects].sort((a, b) => a.order - b.order);
}

export function getAllReasons(): readonly Reason[] {
  return [...data.reasons].sort((a, b) => a.order - b.order);
}

function getOrThrow<Type extends Entity>(
  list: readonly Type[],
  entityId: string,
): Type {
  const entity = list.find((e) => e.id === entityId);
  if (!entity) {
    throw new Error("Could not find entity" + entityId);
  }
  return entity;
}

export function findResultByObjectAndRessort(
  object: VisualisationObject,
  ressort: Ressort,
): Result {
  const cluster = getOrThrow(data.clusters, object.cluster);

  const recommendations = cluster.fidelityToolMaps.flatMap(
    ({ fidelity, toolMap }) => {
      const toolResult = toolMap.find((t) => t.ressorts.includes(ressort.id));
      if (!toolResult) return []; // Return an empty array for flatMap

      return [
        {
          fidelity: getOrThrow(data.fidelities, fidelity),
          primaryTool: getOrThrow(data.tools, toolResult.primaryTool),
          alternativeTools:
            toolResult.alternativeTools?.map((id) =>
              getOrThrow(data.tools, id),
            ) ?? [],
        },
      ];
    },
  );

  return {
    cluster,
    recommendations,
  };
}
