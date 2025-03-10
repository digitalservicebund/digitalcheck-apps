import { createCookie } from "react-router";
import type { PreCheckAnswers } from "~/routes/vorpruefung.$questionId/route";

export const userAnswers = createCookie("user-answers", {
  maxAge: 604_800, // one week
});

export const getAnswersFromCookie = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userAnswers.parse(cookieHeader)) as {
    answers: PreCheckAnswers;
    hasViewedResult: boolean;
  } | null;
  return cookie ?? { answers: {}, hasViewedResult: false };
};

export const getHeaderFromCookie = async (cookie: {
  answers: PreCheckAnswers;
}) => {
  return { headers: { "Set-Cookie": await userAnswers.serialize(cookie) } };
};
