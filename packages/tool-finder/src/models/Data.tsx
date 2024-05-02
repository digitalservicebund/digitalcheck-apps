import type { Cluster } from "./Cluster";
import type { Fidelity } from "./Fidelity";
import type { Notation } from "./Notation";
import type { Reason } from "./Reason";
import type { Ressort } from "./Ressort";
import type { Tool } from "./Tool";
import type { VisualisationObject } from "./VisualisationObject";

export interface Data {
  objects: readonly VisualisationObject[];
  reasons: readonly Reason[];
  clusters: readonly Cluster[];
  notations: readonly Notation[];
  ressorts: readonly Ressort[];
  fidelities: readonly Fidelity[];
  tools: readonly Tool[];
}
