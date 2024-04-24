import data from "resources/data";
import type { Entity } from "./Entity";

export type FidelityId = (typeof data)["fidelities"][number]["id"];

export interface Fidelity extends Entity {
  id: FidelityId;
  name: string;
  order: number;
}
