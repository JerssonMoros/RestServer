const { Usuario, Category, Product, Role} = require('../models');

const validarRol = async( rol='' ) => {
    const respuesta = await Role.findOne({rol});

    if ( !respuesta ) throw new Error(`El rol ${ rol} no esta registrado en la DB`)

}

const validarEmail = async( correo = '') => {
    const respuesta = await Usuario.findOne({correo});
    if ( respuesta ) throw new Error(`${correo} no puede crearse, ya esta en uso.`)
}

const existUserID = async( id ) => { 
    const respuesta = await Usuario.findById(id);
    if ( !respuesta ) throw new Error(`No se encontraron conincidencias para el ID: ${id}` ) 

 }


 const existCategoryId = async ( id ) => {
    const respuesta = await Category.findById(id);
    return (req, res, next) => {
        
        if ( !req.usuario ) {
            return res.status(500).json({
                msj: 'No se esta validando el token'
            })
        } 
        if ( !respuesta ) throw new Error(`Id ${id} not found.`)

        next();
    }


};

const existProductId = async ( id ) =>{
    const res = await Product.findById(id);
    return (req, res, next) => {
        if ( !req.usuario ) {
            return res.status(500).json({
                msj: 'No se esta validando el token'
            })
        } 
        if ( !res ) throw new Error(`Id ${id}  of category not found.`)
        next();
    }
};

//Validar un coleccion en una lista de colecciones.

const validarColeccion = (coleccion = '', colecciones = []) => {
    const existe = colecciones.includes(coleccion);
    if ( !existe ) {
        throw new Error( `La cleccion ${coleccion} no es una coleccion permitida`)
    }
    return true
}

module.exports = { 
    validarRol,
    validarEmail,
    existUserID,
    existCategoryId,
    existProductId,
    validarColeccion,
} 