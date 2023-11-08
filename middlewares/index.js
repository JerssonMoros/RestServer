


const validarCampo = require('../middlewares/validarCampos');
const validarRoles = require('../middlewares/ValidarRoles');
const validarJWT = require('../middlewares/validarJWT');


module.exports = {
    ...validarCampo,
    ...validarJWT,
    ...validarRoles
}