import { dokumentationPrinzipienRoutes } from "@/config/prinzipienRoutes";
import {
  assistent_dokumentation_abschliessen,
  assistent_dokumentation_beteiligungsformate,
  assistent_dokumentation_euInteroperabilitaet,
  assistent_dokumentation_euInteroperabilitaet_organisatorisch,
  assistent_dokumentation_euInteroperabilitaet_rechtlich,
  assistent_dokumentation_euInteroperabilitaet_semantisch,
  assistent_dokumentation_euInteroperabilitaet_technisch,
  assistent_dokumentation_euInteroperabilitaet_verbindlicheAnforderungen,
  assistent_dokumentation_euInteroperabilitaet_veroeffentlichung,
  assistent_dokumentation_regelungsvorhaben,
  assistent_dokumentation_zusammenfassung,
} from "@/config/routes";
import { compileFlowConfig } from "form-graph-engine";

// The Prinzip pages share the dynamic route [principleId].astro, so their paths
// come from prinzipienRoutes.ts (sorted by order) instead of the generated routes.
const [prinzip1, prinzip2, prinzip3, prinzip4, prinzip5] =
  dokumentationPrinzipienRoutes;

// TODO: add page schemas and guards (e.g. skip EU steps without EU-Bezug)
export const dokumentationFlow = compileFlowConfig({
  pages: {
    regelungsvorhaben: { path: assistent_dokumentation_regelungsvorhaben.path },
    beteiligungsformate: {
      path: assistent_dokumentation_beteiligungsformate.path,
    },
    prinzip1: { path: prinzip1.path },
    prinzip2: { path: prinzip2.path },
    prinzip3: { path: prinzip3.path },
    prinzip4: { path: prinzip4.path },
    prinzip5: { path: prinzip5.path },
    euInteroperabilitaet: {
      path: assistent_dokumentation_euInteroperabilitaet.path,
    },
    verbindlicheAnforderungen: {
      path: assistent_dokumentation_euInteroperabilitaet_verbindlicheAnforderungen.path,
    },
    rechtlich: {
      path: assistent_dokumentation_euInteroperabilitaet_rechtlich.path,
    },
    organisatorisch: {
      path: assistent_dokumentation_euInteroperabilitaet_organisatorisch.path,
    },
    semantisch: {
      path: assistent_dokumentation_euInteroperabilitaet_semantisch.path,
    },
    technisch: {
      path: assistent_dokumentation_euInteroperabilitaet_technisch.path,
    },
    veroeffentlichung: {
      path: assistent_dokumentation_euInteroperabilitaet_veroeffentlichung.path,
    },
    zusammenfassung: { path: assistent_dokumentation_zusammenfassung.path },
    abschliessen: { path: assistent_dokumentation_abschliessen.path },
  },
  transitions: {
    regelungsvorhaben: "beteiligungsformate",
    beteiligungsformate: "prinzip1",
    prinzip1: "prinzip2",
    prinzip2: "prinzip3",
    prinzip3: "prinzip4",
    prinzip4: "prinzip5",
    prinzip5: "euInteroperabilitaet",
    euInteroperabilitaet: "verbindlicheAnforderungen",
    verbindlicheAnforderungen: "rechtlich",
    rechtlich: "organisatorisch",
    organisatorisch: "semantisch",
    semantisch: "technisch",
    technisch: "veroeffentlichung",
    veroeffentlichung: "zusammenfassung",
    zusammenfassung: "abschliessen",
    abschliessen: null,
  },
  initialStep: "regelungsvorhaben",
});
