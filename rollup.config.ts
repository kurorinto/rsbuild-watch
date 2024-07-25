import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import clear from "rollup-plugin-clear";
import typescript from '@rollup/plugin-typescript';
export default defineConfig({
  input: {
    index: "src/index",
  },
  output: {
    dir: "dist",
    format: "cjs",
  },
  external: ["@rsbuild/core"],
  plugins: [
    clear({
      targets: ['dist'],
      watch: true,
    }),
    json(),
    commonjs(),
    typescript({
      sourceMap: true,
    }),
    resolve({ extensions: [".js", ".ts"], modulesOnly: true }),
  ],
});
