import { createCookie } from "@remix-run/node";
import { Answers } from "routes/vorpruefung.$questionId/types";

export const userAnswers = createCookie("user-answers", {
  maxAge: 604_800, // one week
});

export const getCookie = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  return ((await userAnswers.parse(cookieHeader)) || {}) as {
    answers: Answers;
  };
};
