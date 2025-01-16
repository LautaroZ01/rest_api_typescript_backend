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
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:4000'];

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        if (!origin) {
            return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS'))
    },
}

server.use(cors(corsOptions))

server.use(cors(corsOptions))

// Leer datos de Formulario
server.use(express.json())

server.use(morgan('dev'))

server.use('/api/products', router)

// Docs
server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUIOptions))

export default server