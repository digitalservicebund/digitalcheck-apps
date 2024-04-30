import data from "resources/data";
import type { ClusterId } from "./Cluster";
import type { Entity } from "./Entity";

type VisualisationObjectId = (typeof data)["objects"][number]["id"];

export interface VisualisationObject extends Entity {
  id: VisualisationObjectId;
  name: string;
  description?: string;
  cluster: ClusterId;
  order: number;
}
