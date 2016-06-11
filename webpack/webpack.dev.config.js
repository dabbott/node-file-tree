const path = require('path')
const webpack = require('webpack')

const options = require('./webpack.config.js')

options.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  })
)

options.devtool = 'cheap-eval-source-map'

module.exports = options
