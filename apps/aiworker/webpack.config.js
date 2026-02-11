const nodeExternals = require('webpack-node-externals')

module.exports = config => ({
  ...config,
  externals: [
    ...config.externals,
    nodeExternals({
      allowlist: [/^@cook-me\//],
    }),
  ],
})
