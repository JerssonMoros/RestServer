const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        require: true
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    description: {
        type: String,
        default: 'No description'
    },
    cantidad: {
        type: Number,
        default: 0,
    }
})

ProductSchema.methods.toJSON = function() {
    const { __v, _id, state, ...product } = this.toObject()
    product.uid = _id
    return product
}


module.exports = model('Product', ProductSchema)