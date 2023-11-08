const jwt = require('jsonwebtoken')
const Usuario = require('../models/user');

const validarJWT = async (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRET)

        // Obtener el usuario que se encontro en el token
        const usuario = await Usuario.findById(uid)


        if ( !usuario) {
            return res.status(401).json({
                msg: 'Token no valido - No existe el usuario'
            })
        }

        //Verificar si el usuario del token esta activo
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no valido - usuario desactivado'
            })
        }
        req.usuario = usuario
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = { 
    validarJWT
}