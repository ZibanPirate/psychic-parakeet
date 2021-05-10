/* eslint-disable @typescript-eslint/no-var-requires */
// required modules
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const autoprefixer = require("autoprefixer");
const precss = require("precss");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// setting up project configurations and some env variables
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.DEV_SERVER_PORT || 8080;
const distFolder = "./dist";
const publicResourcesPath = "w/";
const publicPath = "/";
const nonCodeFiles = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "ico",
  "ttf",
  "woff",
  "woff2",
];
const page = {
  title: "Parakeet",
  description: "Search OMDB movies",
  ogImage:
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1480&q=80",
  themeColor: "#228288",
  keywords: "",
  lang: "en",
};

// exporting configs
module.exports = {
  // https://webpack.js.org/configuration/entry-context/
  entry: path.join(__dirname, "./src/entry/index.tsx"),
  // https://webpack.js.org/concepts/output/#multiple-entry-points
  output: {
    chunkFilename: publicResourcesPath + "/chunk.[contenthash].js",
    filename: publicResourcesPath + "/bundle.[name].[contenthash].js",
    path: __dirname + "/" + distFolder + "/" + publicPath,
    publicPath: publicPath,
  },
  module: {
    rules: [
      // TS / TSX
      {
        include: path.resolve(__dirname, "src"),
        // https://github.com/babel/babel-loader
        loader: "babel-loader",
        test: /\.tsx?$/,
      },
      // SCSS / SASS
      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
          // extracts CSS into separate files, see https://webpack.js.org/plugins/mini-css-extract-plugin
          MiniCssExtractPlugin.loader,
          // https://webpack.js.org/loaders/css-loader/
          "css-loader",
          // https://github.com/postcss/postcss-loader#plugins
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: { plugins: [autoprefixer, precss] },
            },
          },
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      // Non-Code files (assets)
      {
        test: new RegExp(`\.(${nonCodeFiles.join("|")})$`),
        // https://github.com/webpack-contrib/file-loader
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: publicResourcesPath + "/assets",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // https://webpack.js.org/plugins/hot-module-replacement-plugin/
    isDevelopment ? new webpack.HotModuleReplacementPlugin() : () => null,
    // https://webpack.js.org/plugins/mini-css-extract-plugin
    new MiniCssExtractPlugin({
      filename: publicResourcesPath + "/bundle.[contenthash].css",
      chunkFilename: publicResourcesPath + "/chunk.[contenthash].css",
    }),
    // https://webpack.js.org/plugins/html-webpack-plugin/
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: `pug-loader!./src/entry/index.pug`,
      templateParameters: {
        isDev: isDevelopment,
        // SEO info
        ...page,
      },
    }),
  ],
  resolve: {
    // https://webpack.js.org/configuration/resolve/#resolvealias
    alias: { src: path.resolve(__dirname, "src") },
    // https://webpack.js.org/configuration/resolve/#resolveextensions
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    contentBase: distFolder,
    compress: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    hot: true,
    liveReload: false,
    disableHostCheck: true,
    host: "0.0.0.0",
    port,
    writeToDisk: false,
    historyApiFallback: {
      disableDotRule: true,
    },
    stats: "minimal",
  },
  // https://webpack.js.org/configuration/stats/
  stats: "minimal",
  // https://webpack.js.org/configuration/target/
  target: "web",
  // https://webpack.js.org/configuration/devtool/#development
  devtool: isProduction ? false : "eval-source-map",
  // https://webpack.js.org/configuration/mode/
  mode: isProduction ? "production" : isDevelopment ? "development" : "none",
  // https://webpack.js.org/configuration/optimization/#optimizationminimizer
  optimization: {
    minimizer: [new TerserJSPlugin({}), new CssMinimizerPlugin({})],
  },
};
