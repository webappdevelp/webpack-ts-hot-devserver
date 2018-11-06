const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const resolve = require("resolve");
const paths = require("./paths");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: [
    require.resolve("../scripts/utils/webpackHotDevClient"),
    paths.appIndexJs
  ],
  output: {
    filename: "static/js/bundle.js",
    chunkFilename: "static/js/[name].chunk.js",
    publicPath: "/"
  },
  resolve: {
    extensions: paths.fileExtensions
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)/,
        enforce: "pre",
        include: paths.appSrc,
        use: [
          {
            loader: require.resolve("tslint-loader"),
            options: {
              configFile: paths.tsLintConfig
            }
          }
        ]
      },
      {
        test: /\.(ts|tsx)/,
        include: paths.appSrc,
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              cacheDirectory: true,
              cacheCompression: false,
              sourceMaps: false,
              presets: [
                [
                  require.resolve("@babel/preset-env"),
                  {
                    modules: false,
                    useBuiltIns: "usage"
                  }
                ]
              ]
            }
          }
        ]
      },
      {
        test: /\.(ts|tsx)/,
        include: paths.appSrc,
        loader: require.resolve("ts-loader"),
        options: {
          transpileOnly: true,
          configFile: paths.tsConfigJson
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin({
      typescript: resolve.sync("typescript", {
        basedir: paths.appNodeModules
      }),
      async: false,
      checkSyntacticErrors: true,
      reportFiles: [
        "**",
        "!**/*.json",
        "!**/__tests__/**",
        "!**/?(*.)(spec|test).*",
        "!src/setupProxy.js",
        "!src/setupTests.*"
      ],
      watch: paths.appSrc,
      silent: false
      // tslint: paths.tsLintConfig
    })
  ]
};
