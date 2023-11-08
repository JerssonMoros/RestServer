const { request, response } = require('express');
const { Product } = require('../models');

const getProducts = async(req = request, res = response) => {

    try {
    
        const {limit = 5, begin=0} = req.query;
        const query = {state : true}
    
        const [total, products] = await Promise.all([
            Product.count(query),
            Product.find(query)
                .skip(Number(begin))
                .limit(Number(limit))
                .populate('user', 'nombre correo')
                .populate('category', 'name' )
        ])
    
        return res.status(200).json({
            msg: 'Completed',
            ok: true,
            total,
            products
        });
        
    } catch (error) {
        return res.status(500).json({
            msg: 'Internal Error',
            error
        })
    }
}

const getProduct = async ( req=request, res=response ) =>{

    try {
        console.log(req)
        const { id } = req.params
        const product = await Product.findById( id )
                                            .populate('user', '-_id nombre correo')
                                            .populate('category', 'name' )

        if ( !product.state ) {
            return res.status(200).json({
                msg: `Product ${product.name} is desable` ,
                ok: true,
            });
        }

        return res.status(200).json({
            msg: 'Ok',
            ok: true,
            product
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Internal Error',
            error
        })
    }
};

const putProduct = async (req=request, res=response) => { 
    try {
        const { id } = req.params;
        let { state, user, name, ...data } = req.body;
        if ( name ) {
            data.name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        }
        const product = await Product.findByIdAndUpdate(id, data, {new: true});
        
        return res.status(200).json({
            msg: 'Update completed!',
            ok: true,
            product
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

const deleteProduct = async (req=request, res=response) =>{
    try {
        const { id } = req.params;
        const category = await Product.findByIdAndUpdate(id, {state: false}, {new: true});

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

const postProduct = async (req = request, res = response) =>{
    const { state, ...data  } = req.body;
    data.name = data.name.charAt(0).toUpperCase() + data.name.slice(1).toLowerCase()

    let product = await Product.findOne({name: data.name})

    if ( product ) {
        return res.status(400).json({
            msg: `Product ${data.name} already exist!`,
            ok: false,
        });
    }

    // Save data
    data.user = req.usuario._id

    product = new Product( data );
    await product.save();


    res.status(201).json({
        product
    })
};

module.exports = {
    postProduct,
    getProducts,
    getProduct,
    putProduct,
    deleteProduct
}