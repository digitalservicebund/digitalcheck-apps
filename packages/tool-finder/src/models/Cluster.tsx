import data from "resources/data";
import type { Entity } from "./Entity";
import type { FidelityId } from "./Fidelity";
import type { Image } from "./Image";
import type { NotationId } from "./Notation";
import type { RessortId } from "./Ressort";
import type { ToolId } from "./Tool";

export type ClusterId = (typeof data)["clusters"][number]["id"];

export interface Cluster extends Entity {
  id: ClusterId;
  name: string;
  notations: readonly NotationId[];
  description: string;
  img: Image;
  fidelityToolMaps: readonly {
    fidelity: FidelityId;
    toolMap: readonly {
      ressorts: readonly RessortId[];
      primaryTool: ToolId;
      alternativeTools?: readonly ToolId[];
    }[];
  }[];
}
