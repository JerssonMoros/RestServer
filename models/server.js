const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');

require('dotenv').config();

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosRoutePath = 

        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            users: '/api/hello',
            search: '/api/search',
            uploads: '/api/upload',
        }

        // Conectar a DB
        this.conectarDB();      

        // Middlewares
        this.middlewares();

        // Rutas de la app
        this.routes();        
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

        //FileUploads - Carga de Archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true 
        }));

    }
    routes(){
        this.app.use(this.paths.users, require('../routes/user'));
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }
};

module.exports = Server;

