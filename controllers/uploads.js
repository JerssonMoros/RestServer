const { response } = require("express");
const { cargarArchivo } = require("../functions");
const { Usuario, Product } = require("../models");
const path = require('path');
const fs = require('fs')
const cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL);

const listarImagen = async ( req, res ) => {
    const { id, collection } = req.params;
    let modelo;

    switch (collection) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usario con el id ${id}` 
                })
            }
            break;
        case 'productos':
            modelo = await Product.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}` 
                })
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Falta agregar esta validacion'
            });
    }

    // Limpiar imagen cargada anteriormente
    if ( modelo.img ){
        const pathImagen = path.join( __dirname, '../uploads', collection, modelo.img )
        if ( fs.existsSync( pathImagen ) ) {
            return res.status(200).sendFile( pathImagen )
        }
    }

    const pathImagen = path.join( __dirname, '../assets/no-image.jpg')
    res.status(400).sendFile(pathImagen);
    
}

const cargarArchivos = async ( req, res = response ) => {

    try {
        const nombreFichero = await cargarArchivo(req.files, undefined, 'prueba')
        res.json({
            nombreFichero
        })
        
    } catch (msg) {
        return res.status(400).json({msg})
    }
}

const actualizarArchivos = async (req, res = response) => {
    const {id, collection } = req.params;
    let modelo;

    switch (collection) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usario con el id ${id}` 
                })
            }
            break;
        case 'productos':
            modelo = await Product.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}` 
                })
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Falta agregar esta validacion'
            });
    }

    // Limpiar imagen cargada anteriormente
    if ( modelo.img ){
        const pathImagen = path.join(__dirname, '../uploads', collection, modelo.img)
        if ( fs.existsSync( pathImagen) ) {
            fs.unlinkSync( pathImagen);
        }
    }

    modelo.img = await cargarArchivo(req.files, undefined, collection)
    
    await modelo.save();
    res.json({
        id,
        collection,
        modelo
    })
}
const actualizarArchivosCloudinary = async (req, res = response) => {

    const { id, collection } = req.params;
    let modelo;

    switch (collection) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usario con el id ${id}` 
                })
            }
            break;
        case 'productos':
            modelo = await Product.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}` 
                })
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Falta agregar esta validacion'
            });
    }

    // Limpiar imagen cargada anteriormente
    if ( modelo.img ){
        const separacionPath = modelo.img.split('/')
        const nombreIamgen = separacionPath[separacionPath.length - 1].split(".")[0];;
        await cloudinary.uploader.destroy( nombreIamgen );
    }

    //Cargar la nueva imagen
    try {
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath ); 
        
        modelo.img = secure_url;
        await modelo.save();

        res.json({
            modelo
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: `Error ${ error }`
        })
    }

    // modelo.img = await cargarArchivo(req.files, undefined, collection)
    
    // await modelo.save();
    
}

module.exports = {
    cargarArchivos,
    listarImagen,
    actualizarArchivosCloudinary
}