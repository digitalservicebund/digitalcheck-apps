import data from "resources/data";
import type { Entity } from "./Entity";

export type RessortId = (typeof data)["ressorts"][number]["id"];

export interface Ressort extends Entity {
  id: RessortId;
  name: string;
}
