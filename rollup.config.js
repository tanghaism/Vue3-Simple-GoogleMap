import VuePlugin from "rollup-plugin-vue";
import PostCSS from "rollup-plugin-postcss";
import NodeResolve from "@rollup/plugin-node-resolve";
import CommonJS from "@rollup/plugin-commonjs";

/** @type {import('rollup').RollupOptions[]} */
const config = [
  {
    input: "src/index.js",
    output: {
      file: "dist/app.js",
      format: "esm",
      sourcemap: false,
    },
    plugins: [
      NodeResolve(),
      VuePlugin({
        cssModulesOptions: {
          generateScopedName: "[local]___[hash:base64:5]",
        },
      }),
      CommonJS(),
      PostCSS(),
    ],
    external(id) {
      return /^(vue)$/.test(id);
    },
  },
];

export default config;
