const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampo, validateImage } = require('../middlewares');
const { cargarArchivos, listarImagen, actualizarArchivosCloudinary } = require('../controllers/uploads');
const { validarColeccion } = require('../functions');

const router = Router();
router.get('/:collection/:id',[
    check('id', 'El id debe de ser un id de mongo').isMongoId(),
    check('collection').custom(c => validarColeccion(c,['usuarios','productos'])),
    validarCampo
], listarImagen);

router.post('/', validateImage, cargarArchivos);

router.put('/:collection/:id', [
    validateImage,
    check('id', 'El id debe de ser un id de mongo').isMongoId(),
    check('collection').custom(c => validarColeccion(c,['usuarios','productos'])),
    validarCampo
], actualizarArchivosCloudinary )

module.exports = router;
