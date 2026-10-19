export type PreCheckResult = {
  digital: ResultType;
  interoperability: ResultType;
  euBezug: ResultType;
};

export enum ResultType {
  POSITIVE = "Positiv",
  NEGATIVE = "Negativ",
  UNSURE = "Unsicher",
}
