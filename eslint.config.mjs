import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    files: ["**/*.{js,jsx,mjs}"],
    rules: {
      "react-hooks/set-state-in-effect": "off"
    }
  },
  {
    ignores: [".next/**", "node_modules/**", "out/**", "dist/**"]
  }
];

export default eslintConfig;
