import data from "resources/data";
import type { Entity } from "./Entity";

type ReasonId = (typeof data)["reasons"][number]["id"];

export interface Reason extends Entity {
  id: ReasonId;
  name: string;
  description?: string;
  order: number;
}
