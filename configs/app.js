'use strict'

import { config } from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import userRoutes from '../src/user/user.routes.js'

const app = express()
config()
const port = process.env.PORT

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.use(userRoutes)

export const initServer = () => {
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}