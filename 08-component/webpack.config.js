const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const rootPath = path.resolve(__dirname);

module.exports = {
  entry: path.join(rootPath, "main.js"),
  output: {
    filename: "main.js",
    path: path.join(rootPath, "dist"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({
    template: path.join(rootPath, "./index.html")
  })],
};
