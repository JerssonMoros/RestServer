const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampo,validarRoleAdmin, validarRole, validarJWT  } = require('../middlewares')

const { getUser, postUser, deleteUser, putUser } = require('../controllers/user');
const { validarRol, validarEmail, existUserID } = require('../functions/validatorDB');

const router = Router();

router.get('/', getUser);

router.put('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('rol').custom( validarRol ),
    check('id').custom(existUserID),
    validarCampo

], putUser);

router.post('/',[
    check('correo', 'El correo no es valido').isEmail(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de tener mas de 8 caracteres').isLength({min: 8}),
    check('password', 'El password debe de tener menos de 16 caracteres').isLength({max: 16}),
    // check('rol', 'No es un rol valido').isIn(['ADMIN', 'USER']),
    check('correo').custom( validarEmail ),
    check('rol').custom( validarRol ),
    validarCampo
], postUser );

router.delete('/:id',[
    validarJWT,
    validarRoleAdmin,
    // validarRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existUserID),
    validarCampo
], deleteUser);

module.exports = router;
