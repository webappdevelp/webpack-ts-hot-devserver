const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativeApp => path.resolve(appDirectory, relativeApp);

module.exports = {
  appPath: resolveApp("."),
  appSrc: resolveApp("src"),
  appBuild: resolveApp("build"),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('src/index.html'),
  appIndexJs: resolveApp("src/index.ts"),
  appPackageJson: resolveApp("package.json"),
  appNodeModules: resolveApp('node_modules'),
  tsConfigJson: resolveApp("tsconfig.json"),
  tsLintConfig: resolveApp("tslint.json"),
  yarnLockFile: resolveApp('yarn.lock'),
  fileExtensions: [".js", ".ts", ".jsx", ".tsx"]
};
