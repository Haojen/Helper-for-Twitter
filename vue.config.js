const path = require('path')

const isDevMode = process.env.NODE_ENV === 'development'
const distFolder = path.resolve('/Users/haojen/Documents/Code/Twitter-Helper-Safari/Shared (Extension)/Resources')

module.exports = {
  pages: {
    content: {
      entry: 'src/entry/content.ts',
    },
    popup: {
      entry: 'src/entry/popup.ts',
      template: 'public/popup.html'
    }
  },
  outputDir: distFolder,
  filenameHashing: false,
  chainWebpack: (config) => {
    config.plugin('copy').use(require('copy-webpack-plugin'), [
      {
        patterns: [
          {
            from: path.resolve(`src/manifest.${process.env.NODE_ENV}.json`),
            to: `${distFolder}/manifest.json`
          },
          {
            from: path.resolve(`images/`),
            to: `${distFolder}/images`
          },
          {
            from: path.resolve('_locales/'),
            to: `${distFolder}/_locales`
          }
        ]
      }
    ])
  },
  configureWebpack: {
    output: {
      filename: `[name].js`,
      chunkFilename: `[name].js`
    },
    devtool: isDevMode ? 'inline-source-map' : false
  },
  css: {
    extract: false // Make sure the css is the same
  }
}
