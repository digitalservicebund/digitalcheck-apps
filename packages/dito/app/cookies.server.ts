import { createCookie } from "@remix-run/node";
import type { Answers } from "routes/vorpruefung.$questionId/route";

export const userAnswers = createCookie("user-answers", {
  maxAge: 604_800, // one week
});

export const getCookie = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userAnswers.parse(cookieHeader)) as {
    answers: Answers;
  } | null;
  return cookie ? cookie : { answers: {} };
};
