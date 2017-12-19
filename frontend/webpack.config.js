const { DefinePlugin } = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist",
  },

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
   ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "bench",
      template: __dirname + "/src/index.html",
      filename: __dirname + "/dist/index.html",
    }),
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.APP_ENV),
      "process.env.GITHUB_CLIENT_ID": JSON.stringify(process.env.GITHUB_CLIENT_ID),
    }),
  ],
}
