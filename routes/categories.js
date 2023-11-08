const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampo, validarRoleAdmin } = require('../middlewares');
const { postCategory, getCategories, getCategory, putCategory, deleteCategory} = require('../controllers/categories');
const { existCategoryId } = require('../functions/validatorDB');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', getCategories)

// Obtener la categoria por ID - publico
router.get('/:id',
[
    check('id', 'No es un ID de mongo valido').isMongoId(),
    check('id').custom(existCategoryId),
    validarCampo
],
 getCategory)

// Crear una categoria - privado - culquier persona con un token valido
router.post('/', [
    validarJWT,
    check('name', 'The name is required').not().isEmpty(),
    validarCampo
    ],postCategory)

// actualizar- privado - culquier persona con un token valido
router.put('/:id',
 [ 
    validarJWT,
    check('id', 'No es un ID de mongo valido').isMongoId(),
    check('name', 'The name is required').not().isEmpty(),
    check('id').custom(existCategoryId),
    validarCampo
 ],
 putCategory)

// Borrar una categoria - Admin
router.delete('/:id',
[
    validarJWT,
    validarRoleAdmin,
    check('id', 'No es un ID de mongo valido').isMongoId(),
    check('id').custom(existCategoryId),
    validarCampo
],
 deleteCategory)




module.exports = router;
