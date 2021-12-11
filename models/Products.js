const { Schema, model } = require('mongoose')

const schema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [6, 'Name must be at least 6 characters long'],
    },
    type: {
        type: String,
        required: [true, 'Type is required'],
        minLength: [4, 'Type must be at least 4 characters long'],
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: [1850, 'Year must be between 1850 and 2021'],
        max:[2021,'Year must be between 1850 and 2021']
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        minLength: [4, 'City must be at least 4 characters long'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Image is required'],
        match: [/^https?:\/\//, ' Image should start with http:// or https://']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxLength: [60, 'The Description should be a maximum of 60 characters long.']
    },
    availablePieces:{
        type: Number,
        required: [true, 'Available Pieces  is required'],
        min: [0, 'Available Pieces  must be between 0 and 10'],
        max:[10,'Available Pieces  must be between 0 and 10']
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    tenants: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    
}, {timestamps:true})

module.exports = model('Product', schema)
