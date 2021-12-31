const hbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const express = require('express')

const authMiddleware = require('../middlewares/auth.js')

module.exports = (app) => {
    app.engine('hbs', hbs({
        extname: 'hbs'
    }))
    app.set('view engine', 'hbs')
    app.use('/static', express.static('static'))
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use(authMiddleware())

}