const fs = require("fs");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const chalk = require("chalk");

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

const paths = require("../config/paths");
const config = require("../config/webpack.config.dev");
const createDevServerConfig = require("../config/webpackDevServer.config");
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls
} = require("./utils/webpackDevServerUtils");
const openBrowser = require("./utils/openBrowser");
const clearConsole = require("./utils/clearConsole");

const protocol = "https";
const host = process.env.HOST || "0.0.0.0";
const isInteractive = process.stdout.isTTY;
const port = parseInt(process.env.PORT, 10) || 3000;
const useYarn = fs.existsSync(paths.yarnLockFile);

const { checkBrowsers } = require("./utils/browsersHelper");
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    return choosePort(host, port);
  })
  .then(port => {
    console.log(port);
    if (port === null) {
      return;
    }
    const appName = require(paths.appPackageJson).name;
    const urls = prepareUrls(protocol, host, port);
    const compiler = createCompiler(webpack, config, appName, urls, useYarn);
    const serverConfig = createDevServerConfig(
      protocol,
      host,
      urls.lanUrlForConfig
    );
    const devServer = new WebpackDevServer(compiler, serverConfig);

    devServer.listen(port, host, err => {
      if (err) {
        return console.log(chalk.red(err));
      }

      console.log(chalk.cyan("Starting the development server...\n"));
      openBrowser(urls.localUrlForBrowser);
    });

    ["SIGINT", "SIGTERM"].forEach(sig => {
      process.on(sig, () => {
        devServer.close();
        process.exit();
      });
    });
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
