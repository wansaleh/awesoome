const path = require('path');
const pkg = require('./package.json');

module.exports = options => ({
  port: 4000,
  entry: 'src/index.js',

  html: {
    template: 'src/index.ejs',
    title: pkg.productName || pkg.name,
    description: pkg.description,
    favicon: 'static/favicon.png'
  },

  // cssModules: true,

  postcss: {
    plugins: [
      require('postcss-cssnext')({ features: { autoprefixer: false } })
    ]
  },

  // autoprefixer: false,

  extendWebpack(config) {
    config.entry('client').prepend('react-hot-loader/patch')

    if (options.analyze) {
      config
        .plugin('analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  }
})