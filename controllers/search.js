const { response } = require("express")
const { ObjectId } = require("mongoose").Types;
const { Usuario, Category, Product} = require('../models');
const collections = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuario = async (dato, res = response) => {
    const isMongoId = ObjectId.isValid( dato );
    if ( isMongoId ) {
        const usuario = await Usuario.findById( dato )
        return res.status(200).json({
            results: (usuario) ? [usuario] : [] 
        })
    }
    const regex = new RegExp( dato , 'i')
    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    })
    res.json({
        results: (usuarios) ? [usuarios] : []
    })
}

const buscarCategoria = async (dato, res = response) => {
    const isMongoId = ObjectId.isValid( dato );
    if ( isMongoId ) {
        const categoria = await Category.findById( dato )
        return res.status(200).json({
            results: (categoria) ? [categoria] : [] 
        })
    }
    const regex = new RegExp( dato , 'i')
    const categorias = await Category.find({
        $and: [{name: regex}, {state: true}]
    })
    res.json({
        results: (categorias) ? [categorias] : []
    })
}

const buscarProducto = async (dato, res = response) => {
    const isMongoId = ObjectId.isValid( dato );
    if ( isMongoId ) {
        const product = await Product.findById( dato ).populate('category', '-_id name')
        return res.status(200).json({
            results: (product) ? [product] : [] 
        })
    }
    const regex = new RegExp( dato , 'i')
    const productos = await Product.find({
        $or: [{name: regex}, {description: regex}],
        $and: [{state: true}]
    }).populate('category', 'name')
    res.json({
        results: (productos) ? [productos] : []
    })
}

const search = (req, res = response) => {
    const { collection, dato } = req.params

    if ( !collections.includes(collection) ) {
        res.status(400).json({
            msg: `Error, las collecciones permitidas son ${collections}`,
        })
    }

    switch (collection) {
        case 'usuarios':
            buscarUsuario(dato, res)
            break;
        case 'categorias':
            buscarCategoria(dato, res)
            break;
        case 'productos':
            buscarProducto(dato, res)
            break;
        default:
            res.status(500).json({
                msg: 'Falta agregar esta collecion'
            })
            break;
    }
}

module.exports = {
    search
}