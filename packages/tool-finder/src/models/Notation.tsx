import data from "resources/data";
import type { Entity } from "./Entity";

export type NotationId = (typeof data)["notations"][number]["id"];

export interface Notation extends Entity {
  id: NotationId;
  name: string;
}
