const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/user');
const { generarJWT } = require('../functions/generarJWT');
const { google_verify } = require('../functions/google_verify');


const postLogin = async (req, res = response) => {
    const {correo, password} = req.body;
    try {

        // Verificar si el correo existe

        const usuario = await Usuario.findOne({correo})
        if ( !usuario ) {
            return res.status(400).json({
                mdg: 'Error, el correo/contrasena no existe - correo',
            })

        }

        // verificar si esta activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                mdg: 'Error, El usuario se encuentra desactivado',
            })

        }

        // verificar la contrasena
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if ( !validPassword) {
            return res.status(400).json({
                mdg: 'Error, La contrasena esta incorrecta',
            })
        }

        // generar JWT 
        const token = await generarJWT(usuario.id);


        res.status(200).json({
            msg: 'login ok',
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
                mdg: 'Error, comuniquese con el administrador',
            })

    }
}

const googleLogin = async(req = request, res = response) =>{
    const { id_token } = req.body;
    try {
        const { correo, nombre, img } = await google_verify( id_token );

        let usuario = await Usuario.findOne({correo});

        if ( !usuario ) {
            // Si no existe se crea
            const data = {
                nombre,
                correo,
                password: 'aaa',
                img,
                google: true
            }
            usuario = new Usuario( data )
            await usuario.save()
        }

        // Validar si el usuario esta en la DB
        if (!usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el ADMIN, usuario bloqueado',
            })
        }

        // Generar JWT

        const token = await generarJWT( usuario.id );

        res.json({
            msg: 'Login correcto',
            token,
            usuario
        })
        
    } catch (error) {
        res.status(400).json({
            msg: "El token no se pudo verificar",
            ok: false,
            error
        })
    }
};

module.exports = { 
    postLogin,
    googleLogin
}