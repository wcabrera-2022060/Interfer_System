'use strict'

import { Router } from 'express'
import { validateJwt } from '../../middlewares/token.js'
import {
    createEnterprise, enterprisesByCategory, enterprisesByImpactLevelASC, enterprisesByImpactLevelDESC,
    enterprisesOrderA_Z, enterprisesOrderYearsASC, enterprisesOrderYearsDESC, enterprisesOrderZ_A, generateReport,
    getEnterprises, updateEnterprise
} from './enterprise.controller.js'

const api = Router()

api.post('/createEnterprise', [validateJwt], createEnterprise)
api.put('/updateEnterprise/:id', [validateJwt], updateEnterprise)
api.get('/getEnterprises', [validateJwt], getEnterprises)
api.get('/enterprisesOrderYearsASC', [validateJwt], enterprisesOrderYearsASC)
api.get('/enterprisesOrderYearsDESC', [validateJwt], enterprisesOrderYearsDESC)
api.get('/enterprisesOrderA_Z', [validateJwt], enterprisesOrderA_Z)
api.get('/enterprisesOrderZ_A', [validateJwt], enterprisesOrderZ_A)
api.post('/enterprisesByCategory', [validateJwt], enterprisesByCategory)
api.get('/enterprisesByImpactLevelASC', [validateJwt], enterprisesByImpactLevelASC)
api.get('/enterprisesByImpactLevelDESC', [validateJwt], enterprisesByImpactLevelDESC)
api.get('/generateReport', [validateJwt], generateReport)

export default api