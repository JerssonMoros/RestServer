const { request, response } = require('express');

const validarRoleAdmin = (req = request, res = response, next) => {
    if ( !req.usuario ) {
        return res.status(500).json({
            msj: 'No se esta validando el token'
        })
    } 

    const { rol, nombre } = req.usuario;

    if ( rol !== 'ADMIN_ROL'){
        return res.status(401).json({
            msj: `El usuario ${nombre} no tiene permisos para realizar esta operacion.`
        
        })
    }
    next();
};

const validateRoles = ( ...roles ) => {
    return (req, res, next) => {
        
        if ( !req.usuario ) {
            return res.status(500).json({
                msj: 'No se esta validando el token'
            })
        } 

        if ( !roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: "User haven't required role",
                ok: false,
            });
        }

        next();
    }


};



module.exports = {
    validarRoleAdmin,
    validateRoles
}

