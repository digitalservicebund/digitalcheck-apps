import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  rules: {
    "body-case": [2, "always", "sentence-case"],
    "body-leading-blank": [2, "always"],
    "header-case": [2, "always", "sentence-case"],
    "header-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 50],
  },
};

export default Configuration;
