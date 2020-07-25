import typescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import copy from "rollup-plugin-copy";

export default {
  input: "./src/main.ts",
  output: {
    file: "./dist/main.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    typescript(),
    resolve(),
    copy({targets: [{ src: "./index.html", dest: "./dist/" }]}),
  ],
};
