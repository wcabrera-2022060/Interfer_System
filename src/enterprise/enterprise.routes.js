'use strict'

import { Router } from 'express'
import { validateJwt } from '../../middlewares/token.js'
import { createEnterprise, enterprisesOrderA_Z, enterprisesOrderYearsASC, enterprisesOrderYearsDESC, enterprisesOrderZ_A, getEnterprises, updateEnterprise } from './enterprise.controller.js'

const api = Router()

api.post('/createEnterprise', [validateJwt], createEnterprise)
api.put('/updateEnterprise/:id', [validateJwt], updateEnterprise)
api.get('/getEnterprises', [validateJwt], getEnterprises)
api.get('/enterprisesOrderYearsASC', [validateJwt], enterprisesOrderYearsASC)
api.get('/enterprisesOrderYearsDESC', [validateJwt], enterprisesOrderYearsDESC)
api.get('/enterprisesOrderA_Z', [validateJwt], enterprisesOrderA_Z)
api.get('/enterprisesOrderZ_A', [validateJwt], enterprisesOrderZ_A)

export default api