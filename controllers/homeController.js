const router = require('express').Router()

router.get('/', async (req,res)=>{
     const products = await req.storage.getAllProducts()
    
    // const products = allProducts.sort((a,b)=> b.createdAt - a.createdAt).slice(0,3)
    
    res.render('home/homest', {products})
})

router.get('/catalog', async (req,res)=>{
    const products = await req.storage.getAllProducts()
    
    res.render('home/home',{products})
})



module.exports = router