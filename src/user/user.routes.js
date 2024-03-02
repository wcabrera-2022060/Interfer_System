'use strict'

import { Router } from 'express'
import { createUser, deleteUser, login, updateUser } from './user.controller.js'
import { validateJwt } from '../../middlewares/token.js'

const api = Router()

api.post('/createUser', createUser)
api.post('/login', login)
api.put('/updateUser/:id', [validateJwt], updateUser)
api.delete('/deleteUser/:id', [validateJwt], deleteUser)

export default api