// config/config.js
  var config = {
    baseUrl: '/login/',
    root: '/',
    app: {
      name: 'subirImagenesApp'
    },
    port: process.env.PORT || 4000,
    db: 'mongodb://localhost/articulosem-test'
  }

  module.exports = config;