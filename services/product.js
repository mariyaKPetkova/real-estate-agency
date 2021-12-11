const Product = require('../models/Products.js')

async function createProduct(productData){
    const product = new Product(productData)
    await product.save()
    return Product
}

async function getAllProducts(){
    const products = await Product.find({}).lean()
    //search
    return products
}

async function getProductById(id){
    const product = await Product.findById(id).populate('author').populate('tenants').lean()
    
    return product
}

async function editProduct(id,productData){
    const product = await Product.findById(id)
    
    product.name = productData.name
    product.type = productData.type
    product.year = productData.year
    product.city = productData.city
    product.imageUrl = productData.imageUrl
    product.description = productData.description
    product.availablePieces = productData.availablePieces
    

    return product.save()
}
async function deleteProduct(product){
    return Product.findOneAndDelete(product)
    
}
async function rentProduct(productId,userId){
    const product = await Product.findById(productId)
    product.tenants.push(userId)
    product.availablePieces --
    return product.save()
}

async function search(text) {
    const pattern = new RegExp(`^${text}$`, 'i')
    const products = await Product.find({ type: pattern }).lean()
    return products
}
module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    editProduct,
    deleteProduct,
    rentProduct,
    search
}