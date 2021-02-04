const path = require("path");

module.exports = {
  root: "./example",
  port: 7070,
  alias: {
    "/@/": path.resolve(__dirname, "src"),
    "/d/": path.resolve(__dirname, "dist"),
  },
};
