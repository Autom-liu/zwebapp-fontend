module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  assetsDir: 'assets',
  devServer: {
    host: '0.0.0.0',
    port: 8090,
    https: false,
    open: true,
    hotOnly: false,
    proxy: {
      '/zwebapp-flow': {
        target: 'http://127.0.0.1:9083',
        ws: false,
        changeOrigin: false,
      },
      '/': {
        target: 'http://127.0.0.1:9080',
        ws: false,
        changeOrigin: false,
      },
    },
  },
};
