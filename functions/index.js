const validatorDB = require('./validatorDB');
const generarJWT = require('./generarJWT');
const googleVerify = require('./google_verify');
const cargarArchivo = require('./cargar-archivos');

module.exports = {
    ...validatorDB,
    ...cargarArchivo,
    ...generarJWT,
    ...googleVerify
}