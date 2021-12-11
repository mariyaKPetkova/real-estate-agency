const router = require('express').Router()

router.get('/', async (req, res) => {
    const allProducts = await req.storage.getAllProducts()

    const products = allProducts.sort((a, b) => b.createdAt - a.createdAt).slice(0, 3)

    res.render('home/homest', { products })
})

router.get('/catalog', async (req, res) => {
    const products = await req.storage.getAllProducts()

    res.render('home/home', { products })
})


router.get('/search', async (req, res) => {
    const search = req.query.searchedText
    const products = await req.storage.search(search)
    console.log(products)
    res.render('home/search',{products})
})




module.exports = router