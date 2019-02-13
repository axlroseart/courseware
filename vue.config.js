const path = require('path')
const devApiUrl = '192.168.30.3'
const devApiPort = '80'
module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? '' : '/',
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html'
    }
  },
  css: {
    loaderOptions: {
      css: {
      }
    }
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(js|vue)$/,
          enforce: 'pre',
          exclude: /node_modules/,
          use: {
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint-friendly-formatter')
            }
          }
        },
        {
          test: /\.(ogg|wav|flac|aac|swf|mov)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 1000,
            name: 'media/[name]--[folder].[ext]?[hash:5]'
          }
        },
        {
          test: /\.styl$/,
          use: ['stylus-loader']
        }
      ]
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.common.js',
        '@': path.join(__dirname, 'src/views/'),
        'assets': path.join(__dirname, 'src/assets'),
        'components': path.join(__dirname, 'src/components')
      },
      extensions: ['.js', '.vue', '.json', '.css', '.node', '.styl']
    }
  },
  devServer: {
    port: 8081,
    // host: '127.0.0.1',
    proxy: {
      '/v1': {
        target: 'http://' + devApiUrl + ':' + devApiPort + '',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
}
