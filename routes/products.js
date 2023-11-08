const { Router } = require('express');
const { check } = require('express-validator');

const { postProduct, getProduct, getProducts, putProduct, deleteProduct } = require('../controllers/products');
const { validarJWT, validarCampo, validateRoles, validarRoleAdmin } = require('../middlewares');
const { existProductId } = require('../functions/validatorDB');

const router = Router();

router.get('/', getProducts);

router.get('/:id',[
    validarJWT,
    check('id', 'ID invalid on Mongo').isMongoId(),
    check('id').custom(existProductId),
    validarCampo
], getProduct);

router.post('/',
[
    validarJWT,
    check('name', 'The name is required').not().isEmpty(),
    validateRoles('ADMIN_ROL', 'VENTAS_ROL'),
    check('category', 'Not is a ID of Mongo').isMongoId(),
    check('id').custom(existProductId),
    validarCampo
], postProduct);

router.put('/:id',[
    validarJWT,
    check('id', 'ID invalid in Mongo').isMongoId(),
    // existCategoryId(category),
    check('id').custom(existProductId),
    validateRoles('ADMIN_ROL', 'VENTAS_ROL'),
    validarCampo
], putProduct);

router.delete('/:id',[
    validarJWT,
    check('id', 'ID invelid in Mongo').isMongoId(),
    check('id').custom(existProductId),
    validarRoleAdmin,
    validarCampo
], deleteProduct);

module.exports = router;