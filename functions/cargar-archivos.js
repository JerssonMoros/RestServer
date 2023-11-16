const path = require('path');
const { v4: uuidv4 } = require('uuid');

const cargarArchivo = (files, extensionesValidas =  [ 'png','jpg','jpeg','gif'], carpeta = '' ) => {
    return new Promise( (resolve, reject) => {
        const { archivo } = files;
        const nameSpliteado = archivo.name.split('.')
        const ext = nameSpliteado[ nameSpliteado.length - 1 ]
    
        if (!extensionesValidas.includes(ext)){
            return reject(`La extension ${ext} no es permitida`)
        }
    
        const nombreTmp = uuidv4() + '.' + ext;
    
        const uploadPath = path.join(__dirname , '../uploads/' , carpeta,  nombreTmp);
    
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }
            resolve ( nombreTmp );
        });

    })
}

module.exports = {
    cargarArchivo
}