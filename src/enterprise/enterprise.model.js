'use strict'

import { Schema, model } from 'mongoose'

const enterpriseSchema = Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        type: String,
        unique: true,
        required: true
    },
    impactLevel: {
        type: String,
        enum: ['HIGH', 'MEDIUM', 'LOW'],
        uppercase: true,
        required: true
    },
    yearsTrajectory: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    }
}, {
    versionKey: false
})

export default model('enterprise', enterpriseSchema)