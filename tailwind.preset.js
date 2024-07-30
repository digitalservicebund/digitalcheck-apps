import angiePlugin from "@digitalservice4germany/angie";
import tailwindPreset from "@digitalservice4germany/style-dictionary/tailwind";

export default {
  presets: [tailwindPreset],
  plugins: [angiePlugin],
  theme: {
    extend: {
      fontFamily: {
        sans: "BundesSansWeb",
      },
    },
  },
  corePlugins: {
    container: false,
  },
};
