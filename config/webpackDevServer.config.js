const paths = require("./paths");
const config = require("./webpack.config.dev");

module.exports = function(protocol, host, allowedHost) {
  return {
    contentBase: paths.appPath,
    watchContentBase: true,
    publicPath: config.output.publicPath,
    host,
    https: protocol === "https",
    compress: true,
    hot: true,
    quiet: true,
    overlay: false,
    public: allowedHost,
    historyApiFallback: {
      disableDotRule: true
    },
    clientLogLevel: "info"
  };
};
