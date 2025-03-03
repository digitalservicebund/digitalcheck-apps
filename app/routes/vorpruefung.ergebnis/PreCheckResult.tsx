export type PreCheckResult = {
  digital: ResultType;
  interoperability: ResultType;
};

export enum ResultType {
  POSITIVE = "Positiv",
  NEGATIVE = "Negativ",
  UNSURE = "Unsicher",
}
