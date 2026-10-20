import { vorpruefung, type Route } from "@/config/routes";
import { preCheck } from "@/resources/content/vorpruefung";

// astro-route-generator skips dynamic routes, so the routes for
// vorpruefung/[questionId].astro are derived from the questions instead.
export const vorpruefungRoutes: Route[] = preCheck.questions.map(
  (question, index) => ({
    key: `vorpruefung_${question.id}`,
    path: question.path,
    title: question.title,
    parent: vorpruefung,
    sitemap: false,
    isStagingOnly: false,
    navOrder: index + 1,
    navLabel: null,
  }),
);
