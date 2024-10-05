const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = (_, argv) => {
  // Set default mode to development
  const mode = argv.mode || "development";
  const isProd = mode === "production";

  return {
    entry: "./src/js/index.js",
    devtool: isProd ? "source-map" : "inline-source-map",
    plugins: [
      new HtmlWebpackPlugin({
        title: "Battleship",
        template: "./src/index.html",
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
      new ESLintPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "resolve-url-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: { filename: "fonts/[name][ext]" },
        },
        {
          test: /\.svg$/i,
          use: "raw-loader",
        },
      ],
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    devServer: {
      static: "./dist",
    },
    optimization: {
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin({ test: /\.js(\?.*)?$/i }),
      ],
    },
  };
};
