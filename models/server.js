const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

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
            search: '/api/search'
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

    }
    routes(){
        this.app.use(this.paths.users, require('../routes/user'))
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.categories, require('../routes/categories'))
        this.app.use(this.paths.products, require('../routes/products'))
        this.app.use(this.paths.search, require('../routes/search'))
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }
};

module.exports = Server;

