import { createCookie } from "@remix-run/node";

export const userAnswers = createCookie("user-answers", {
  maxAge: 604_800, // one week
});
