const NODE_PORT = process.env.NODE_ENV;

module.exports = {
  configureWebpack: {
    devServer: {
      proxy: {
        '/api/v1': {
          target: `http://localhost:${NODE_PORT}`
        }
      }
    }
  }
};