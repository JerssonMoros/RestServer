


const validarCampo = require('../middlewares/validarCampos');
const validarRoles = require('../middlewares/ValidarRoles');
const validarJWT = require('../middlewares/validarJWT');
const validarImage = require('../middlewares/validarImagen')

module.exports = {
    ...validarCampo,
    ...validarJWT,
    ...validarRoles,
    ...validarImage
}