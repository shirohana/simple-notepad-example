module.exports = {
  env: {
    IP: process.env.IP || '0.0.0.0',
    PORT: process.env.PORT || 8080
  },
  dev: {
    APP_LOG_PATH: './log/access.log',
    APP_ERR_PATH: './log/error.log',
    BROWSER_SYNC_ENABLED: true,
    BROWSER_SYNC_PORT: 8082
  },
  webpack: {
    entry: {
      bundle: './src/client/main.js'
    }
  }
};