const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const secret = process.env.SECRET;
        const payload = {
            uid
        };

        jwt.sign(payload, secret, {
            expiresIn: '10h'
        }, (err, token) => {
            if ( err ) {
                console.log(err);
                reject( 'No se genero el token' )
                return
            }
            resolve(token);
        })


    })

}

module.exports = {
    generarJWT
}