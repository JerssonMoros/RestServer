
const validateImage = ( req, res, next ) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: 'No se esta enviando el archivo'
        })
    } 
    next();
};



module.exports = {
    validateImage
}

