export type TQuestion = {
  id: string;
  title: string;
  question: string;
  text: string;
  url: string;
  prevLink: string;
  nextLink: string;
  hint?: {
    title: string;
    text: string;
  };
};

export type Option = {
  value: "yes" | "no" | "not-sure";
  text: string;
};

export type Answers = {
  [x: string]: Option["value"];
};
