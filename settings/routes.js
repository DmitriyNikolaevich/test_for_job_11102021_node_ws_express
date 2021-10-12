'use strict'

module.exports = (app) => {

    const authController = require('../controller/auth')

    app.route(`/auth/:data`).get(authController.auth)
}