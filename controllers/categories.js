const { request, response } = require('express');
const { Category } = require('../models');

const getCategories = async(req = request, res = response) => {

    try {
    
        const {limit = 5, begin=0} = req.query;
        const query = {state : true}
    
        const [total, categories] = await Promise.all([
            Category.count(query),
            Category.find(query)
                .skip(Number(begin))
                .limit(Number(limit))
                .populate('user', '-_id nombre correo')
        ])
    
        return res.status(200).json({
            msg: 'Completed',
            ok: true,
            total,
            categories
        });
        
    } catch (error) {
        return res.status(500).json({
            msg: 'Internal Error',
            error
        })
    }
}


// Obtenercategoria-populate

const getCategory = async ( req=request, res=response ) =>{

    try {
        const { id } = req.params
        const category = await Category.findById( id ).populate('user', '-_id nombre correo')
        console.log(category);

        if ( !category.state ) {
            return res.status(200).json({
                msg: `Category ${category.name} is desable` ,
                ok: true,
            });
        }

        return res.status(200).json({
            msg: 'Ok',
            ok: true,
            category
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Internal Error',
            error
        })
    }
};

// AcualizarCategoria
const putCategory = async (req=request, res=response) => { 
    try {
        const { id } = req.params;
        let { name } = req.body;
        if ( name ) {
            name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        }
        const user = req.usuario._id
        const category = await Category.findByIdAndUpdate(id, {name, user}, {new: true});
        
        return res.status(200).json({
            msg: 'Update completed!',
            ok: true,
            category
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Internal Error',
            error
        })
    }
 }

// BorrarCategoria- state:false

const deleteCategory = async (req=request, res=response) =>{
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(id, {state: false}, {new: true});

        return res.status(200).json({
            msg: 'Delete completed!',
            ok: true,
            category
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Internal Error',
            error
        })
    }



};

const postCategory = async (req = request, res = response) =>{
    let { name } = req.body;
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    console.log(req);
    let category = await Category.findOne({name})

    if ( category ) {
        return res.status(400).json({
            msg: `Category ${name} already exist!`,
            ok: false,
        });
    }

    // Save data
    const data = {
        name,
        user: req.usuario._id
    }

    category = new Category( data );
    await category.save();


    res.status(201).json({
        category
    })
};

module.exports = {
    postCategory,
    getCategories,
    getCategory,
    putCategory,
    deleteCategory
}