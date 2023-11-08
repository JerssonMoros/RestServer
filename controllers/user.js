const { request, response } = require('express');
const Usuario = require('../models/user');
const bcryptjs = require('bcryptjs');

const getUser = async(req = request, res = response) => {
    const {limit = 5, begin=0} = req.query;
    const query = {estado : true}

    const [total, usuarios] = await Promise.all([
        Usuario.count(query),
        Usuario.find(query)
            .skip(Number(begin))
            .limit(Number(limit))
    ])

    res.json({
        total,
        usuarios
    })
}

const putUser = async(req, res) => {
    const { id } = req.params;
    const { password, google, ...resto} = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();    
        resto.password = bcryptjs.hashSync(password, salt)
    }
    console.log(resto);
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    

    res.json({mensaje:'Hello World from put-controller',
        usuario
    })
}

const postUser = async(req, res) => {

    const { nombre, correo, password, img, rol,estado } = req.body;
    const usuario = new Usuario({ nombre, correo, password, img, rol,estado });

    // Encriptar contrasenia
    const salt = bcryptjs.genSaltSync();    
    usuario.password = bcryptjs.hashSync(password, salt)
    // Guardar en la Db
    await usuario.save();

    res.json({mensaje:'Hello World from post-controller', 
        usuario
    })
}

const deleteUser = async (req, res) => {
    const { id } = req.params
    const usuarioAuten = req.usuario

    // eliminar usuario fisicamente
    const usuario = await Usuario.findByIdAndUpdate( id , {estado: false});
    
    res.json({usuario, usuarioAuten})
}

module.exports = {
    getUser,
    putUser,
    postUser,
    deleteUser
}