const router = require('express').Router()
const { body, validationResult } = require('express-validator')
const { isGuest } = require('../middlewares/guards.js')

router.get('/register', isGuest(), (req, res) => {
    res.render('user/register')
})

router.post(
    '/register',
    isGuest(),
    body('fullName')
        .isLength({ min: 3 }).withMessage('Full Name must be at least 2 symbols'),
    body('username')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 symbols')
        .isAlphanumeric().withMessage('Password may contain only latin letters and numbers'),
    body('password')
        .isLength({ min: 3 }).withMessage('Password must be at least 3 symbols'),
    body('repassword').custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error('Passwords do not match')
        }
        return true
    }),
    async (req, res) => {
        const { errors } = validationResult(req)

        try {
            if (errors.length > 0) {
                const message = errors.map(err => err.msg).join('\n')
                throw new Error(message)
            }
            await req.auth.register(req.body.fullName, req.body.username, req.body.password)
            res.redirect('/')
        } catch (err) {
            console.log(errors)
            const ctx = {
                errors: err.message.split('\n'),
                userData: {
                    fullName: req.body.fullName,
                    username:req.body.username
                }
            }
            res.render('user/register', ctx)
        }

    }
)

router.get('/login', isGuest(), (req, res) => {
    res.render('user/login')
})

router.post('/login', isGuest(), async (req, res) => {
    console.log(req.body.username)
    try {
        await req.auth.login(req.body.username, req.body.password)
        res.redirect('/')
    } catch (err) {
        console.log(err)
        const ctx = {
            errors: [err.message],
            userData: {
                username: req.body.username
            }
        }
        res.render('user/login', ctx)
    }
})
router.get('/logout', (req, res) => {
    req.auth.logout()
    res.redirect('/')
})

router.get('/my-posts', async (req, res) => {
    const idAuthor = req.user._id
    const authorName = `${req.user.lname} ${req.user.fname}`

    const posts = await req.storage.getAllProducts()
    const userPosts = posts.filter(x => x.author == idAuthor)
    userPosts.map(x => Object.assign(x, { authorName }))

    res.render('user/my-posts', { userPosts })
})
module.exports = router