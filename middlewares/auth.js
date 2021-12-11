const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userService = require('../services/user.js')
const { COOKIE_NAME, TOKEN_SECRET } = require('../config/index.js')

module.exports = () => (req, res, next) => {

    if (parseToken(req, res)) {
        req.auth = {
            async register(fullName,username, password) {
                const token = await register(fullName,username, password)
                res.cookie(COOKIE_NAME, token)
            },
            async login(username, password) {
                const token = await login(username, password)
                res.cookie(COOKIE_NAME, token)
            },
            logout() {
                res.clearCookie(COOKIE_NAME)
            }
        }
        next()
    }
}


async function register(fullName,username, password) {
    const existUsername = await userService.getUserByUsername(username)

    if (existUsername) {
        throw new Error('Username is taken')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await userService.createUser(fullName,username, hashedPassword)
    return generateToken(user)
}

async function login(username, password) {
    const user = await userService.getUserByUsername(username)
    if (!user) {
        throw new Error('No such username')
    }
    const hasMatch = await bcrypt.compare(password, user.hashedPassword)
    
    if (!hasMatch) {
        throw new Error('Incorrect password')
    }
    return generateToken(user)
}

function generateToken(userData) {
    return jwt.sign({
        _id: userData._id,
        fullName: userData.fullName,
        username: userData.username
    }, TOKEN_SECRET)
}

function parseToken(req, res) {
    const token = req.cookies[COOKIE_NAME]
    if (token) {
        try {
            const userData = jwt.verify(token, TOKEN_SECRET)
            req.user = userData
            res.locals.user = userData
        } catch (err) {
            res.clearCookie(COOKIE_NAME)
            res.redirect('/auth/login')
            return false
        }
    }
    return true
}