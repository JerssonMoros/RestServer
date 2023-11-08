const { Router } = require('express');
const { check } = require('express-validator');
const { postLogin, googleLogin } = require('../controllers/auth');
const { validarCampo } = require('../middlewares/validarCampos');

const router = Router();

// router.get('/', getLogin);

// router.put('/:id', putLogin);

router.post('/', [
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampo
], postLogin );

router.post('/google', [
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampo
], googleLogin );

// router.delete('/:id', deleteLogin);

module.exports = router;
