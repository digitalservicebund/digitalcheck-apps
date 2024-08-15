import { createCookie } from "@remix-run/node";
import type { Answers } from "routes/vorpruefung.$questionId/route";

export const userAnswers = createCookie("user-answers", {
  maxAge: 604_800, // one week
});

export const getAnswersFromCookie = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userAnswers.parse(cookieHeader)) as {
    answers: Answers;
    hasViewedResult: boolean;
  } | null;
  return cookie ?? { answers: {}, hasViewedResult: false };
};

export const getHeaderFromCookie = async (cookie: { answers: Answers }) => {
  return { headers: { "Set-Cookie": await userAnswers.serialize(cookie) } };
};

export const deleteCookie = async () => {
  return {
    headers: { "Set-Cookie": await userAnswers.serialize("", { maxAge: 0 }) },
  };
};
