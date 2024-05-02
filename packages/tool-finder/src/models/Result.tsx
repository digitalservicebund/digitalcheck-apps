import type { Cluster } from "./Cluster";
import type { Fidelity } from "./Fidelity";
import type { Tool } from "./Tool";

export type Recommendation = {
  fidelity: Fidelity;
  primaryTool: Tool;
  alternativeTools: Tool[];
};

export interface Result {
  cluster: Cluster;
  recommendations: Recommendation[];
}
