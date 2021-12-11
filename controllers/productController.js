const router = require('express').Router()
const { isUser } = require('../middlewares/guards.js')
const { deleteProduct } = require('../services/product.js')

router.get('/create', isUser(), async (req, res) => {

    res.render('product/create')
})

router.post('/create', isUser(), async (req, res) => {

    const productData = {
        name: req.body.name,
        type: req.body.type,
        year: req.body.year,
        city: req.body.city,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        availablePieces: req.body.availablePieces,
        author: req.user._id,

    }

    try {
        await req.storage.createProduct(productData)

        res.redirect('/catalog')
    } catch (err) {
        console.log(err)
        let errors
        if (err.errors) {
            errors = Object.values(err.errors).map(e => e.properties.message)
        } else {
            errors = [err.message]
        }

        const ctx = {
            errors,
            productData: {
                name: req.body.name,
                type: req.body.type,
                year: req.body.year,
                city: req.body.city,
                imageUrl: req.body.imageUrl,
                description: req.body.description,
                availablePieces: req.body.availablePieces,
            }

        }
        res.render('product/create', ctx)
    }
})

router.get('/details/:id', async (req, res) => {
    
    try {
        const product = await req.storage.getProductById(req.params.id)
        
        product.hasUser = Boolean(req.user)
        product.isAuthor = req.user && req.user._id == product.author._id
        product.isntAuthor = req.user && (req.user._id != product.author._id)
        product.alreadyRent = req.user && product.tenants.find(x => x._id == req.user._id)
        product.hasTenants = Boolean(product.tenants.length > 0)
        product.tenants = product.tenants.map(x => x.fullName).join(', ')
        product.free = product.availablePieces > 0
        
        res.render('product/details', { product })
    } catch (err) {
        res.redirect('/404')

    }
})
router.get('/edit/:id', isUser(), async (req, res) => {
    try {

        const product = await req.storage.getProductById(req.params.id)

        if (req.user._id != product.author._id) {
            throw new Error('Cannot edit')
        }
        res.render('product/edit', { product })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})
router.post('/edit/:id', isUser(), async (req, res) => {
    try {
        const product = await req.storage.getProductById(req.params.id)
        if (req.user._id != product.author._id) {
            throw new Error('Cannot edit')
        }
        await req.storage.editProduct(req.params.id, req.body)
        res.redirect('/products/details/' + req.params.id)
    } catch (err) {
        let errors
        if (err.errors) {
            errors = Object.values(err.errors).map(e => e.properties.message)
        } else {
            errors = [err.message]
        }

        const ctx = {
            errors,
            product: {
                _id: req.params.id,
                name: req.params.name,
                type:req.params.type,
                year: req.params.year,
                city: req.params.city,
                imageUrl: req.params.imageUrl,
                description: req.params.description,
                availablePieces: req.params.availablePieces,

            }
        }
        res.render('product/edit', ctx)
    }
})

router.get('/delete/:id', isUser(), async (req, res) => {
    
    try {
        const product = await req.storage.getProductById(req.params.id)

        if (req.user._id != product.author._id) {
            throw new Error('Cannot delete')
        }

        deleteProduct(product)
        res.redirect('/catalog')
    } catch (err) {
        res.redirect('/404')
    }
})


router.get('/rent/:id', isUser(), async (req, res) => {
    try {
        const product = await req.storage.getProductById(req.params.id)

        if (req.user._id == product.author._id) {
            throw new Error('Cannot vote')
        }

        await req.storage.rentProduct(req.params.id, req.user._id)
        res.redirect('/products/details/' + req.params.id)

    } catch (err) {
        res.redirect('/404')
    }
})

module.exports = router