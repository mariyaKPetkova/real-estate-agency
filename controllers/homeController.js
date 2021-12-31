const router = require('express').Router()
const productService = require('../services/product.js')

router.get('/', async (req, res) => {
    const allProducts = await productService.getAllProducts()

    const products = allProducts.sort((a, b) => b.createdAt - a.createdAt).slice(0, 3)

    res.render('home/homest', { products })
})

router.get('/catalog', async (req, res) => {
    const products = await productService.getAllProducts()

    res.render('home/home', { products })
})


router.get('/search', async (req, res) => {
    const search = req.query.searchedText
    const products = await productService.search(search)
    console.log(products)
    res.render('home/search',{products})
})




module.exports = router