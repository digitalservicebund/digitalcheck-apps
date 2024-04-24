import data from "resources/data";
import type { Entity } from "./Entity";
import type { Image } from "./Image";

export type ToolId = (typeof data)["tools"][number]["id"];

export interface Tool extends Entity {
  id: ToolId;
  name: string;
  description: string;
  link: string;
  access?: string;
  img: Image;
}
