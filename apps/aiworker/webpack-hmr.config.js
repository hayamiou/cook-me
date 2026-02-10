const path = require('node:path')
const nodeExternals = require('webpack-node-externals')
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin')

module.exports = (options, webpack) => ({
  ...options,
  entry: ['webpack/hot/poll?100', options.entry],
  externals: [
    nodeExternals({
      allowlist: [/^@cook-me\//, 'webpack/hot/poll?100'],
    }),
  ],
  plugins: [
    ...options.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin({
      paths: [/\.js$/, /\.d\.ts$/],
    }),
    new RunScriptWebpackPlugin({ name: options.output.filename, autoRestart: true }),
  ],
})
