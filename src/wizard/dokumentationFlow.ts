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
import {
  beteiligungsformateSchema,
  ebeneSchemas,
  euInteroperabilitaetSchema,
  prinzipSchema,
  regelungsvorhabenSchema,
  verbindlicheAnforderungenSchema,
  veroeffentlichungSchema,
} from "./dokumentationSchema";

// The Prinzip pages share the dynamic route [principleId].astro, so their paths
// come from prinzipienRoutes.ts (sorted by order) instead of the generated routes.
const [prinzip1, prinzip2, prinzip3, prinzip4, prinzip5] =
  dokumentationPrinzipienRoutes;

// Page schemas live in dokumentationSchema.ts, so steps can use them too (see stepFields).
// TODO: add remaining page schemas and guards (e.g. skip EU steps without EU-Bezug)
export const dokumentationFlow = compileFlowConfig({
  pages: {
    regelungsvorhaben: {
      path: assistent_dokumentation_regelungsvorhaben.path,
      pageSchema: regelungsvorhabenSchema,
    },
    beteiligungsformate: {
      path: assistent_dokumentation_beteiligungsformate.path,
      pageSchema: beteiligungsformateSchema,
    },
    prinzip1: { path: prinzip1.path, pageSchema: prinzipSchema(1) },
    prinzip2: { path: prinzip2.path, pageSchema: prinzipSchema(2) },
    prinzip3: { path: prinzip3.path, pageSchema: prinzipSchema(3) },
    prinzip4: { path: prinzip4.path, pageSchema: prinzipSchema(4) },
    prinzip5: { path: prinzip5.path, pageSchema: prinzipSchema(5) },
    euInteroperabilitaet: {
      path: assistent_dokumentation_euInteroperabilitaet.path,
      pageSchema: euInteroperabilitaetSchema,
    },
    verbindlicheAnforderungen: {
      path: assistent_dokumentation_euInteroperabilitaet_verbindlicheAnforderungen.path,
      pageSchema: verbindlicheAnforderungenSchema,
    },
    rechtlich: {
      path: assistent_dokumentation_euInteroperabilitaet_rechtlich.path,
      pageSchema: ebeneSchemas.rechtlich,
    },
    organisatorisch: {
      path: assistent_dokumentation_euInteroperabilitaet_organisatorisch.path,
      pageSchema: ebeneSchemas.organisatorisch,
    },
    semantisch: {
      path: assistent_dokumentation_euInteroperabilitaet_semantisch.path,
      pageSchema: ebeneSchemas.semantisch,
    },
    technisch: {
      path: assistent_dokumentation_euInteroperabilitaet_technisch.path,
      pageSchema: ebeneSchemas.technisch,
    },
    veroeffentlichung: {
      path: assistent_dokumentation_euInteroperabilitaet_veroeffentlichung.path,
      pageSchema: veroeffentlichungSchema,
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
