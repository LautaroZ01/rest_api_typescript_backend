import express from 'express'
import { router } from './router'
import colors from 'colors'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'
import swaggerUI from 'swagger-ui-express'
import swaggerSpec, { swaggerUIOptions } from './config/swagger'
import db from './config/db'

// Conectar a base de datos
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        // console.log(colors.blue('Conexion exitosa'))
    } catch (error) {
        // console.log(error)
        console.log(colors.green.bold('Hubo un error al conectar a la BD'))
    }
}

connectDB()

// Instancia de express
const server = express()

// Permitir conexiones
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (origin === process.env.FRONTEND_URL) {
            callback(null, true)
        }else{
            callback(new Error('Error de CORS'))
        }
    }
}

server.use(cors(corsOptions))

// Leer datos de Formulario
server.use(express.json())

server.use(morgan('dev'))

server.use('/api/products', router)

// Docs
server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUIOptions))

export default server