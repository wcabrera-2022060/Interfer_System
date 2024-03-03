'use strict'

import Enterprise from '../enterprise/enterprise.model.js'

export const createEnterprise = async (req, res) => {
    try {
        let data = req.body
        const required = ['name', 'address', 'impactLevel', 'yearsTrajectory', 'category']
        let missingData = required.filter(field => !data[field] || data[field].replaceAll(' ', '').length === 0)
        if (missingData.length > 0) return res.status(400).send({ message: `Missing required fields ${missingData.join(', ')}` })
        let enterprise = await Enterprise.findOne({ $or: [{ name: data.name }, { address: data.address }] })
        if (enterprise) return res.status(409).send({ message: 'Name or address not availble' })
        if (!['HIGH', 'MEDIUM', 'LOW'].includes(data.impactLevel.toUpperCase())) return res.status(400).send({ message: 'impactLevel can only have one of these values HIGH, MEDIUM or LOW' })
        if (isNaN(data.yearsTrajectory)) return res.status(400).send({ message: 'yearsTrajectory has to be a number' })
        let newEnterprise = new Enterprise(data)
        await newEnterprise.save()
        return res.send({ message: 'Enterprise created successfully', newEnterprise })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error creating enterprise' })
    }
}

export const updateEnterprise = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let missingData = []
        for (let key in data) {
            if (data[key].replaceAll(' ', '').length === 0) {
                missingData.push(key)
            }
        }
        if (missingData.length > 0) return res.status(400).send({ message: `Missing data ${missingData.join(', ')}` })
        if (!['HIGH', 'MEDIUM', 'LOW'].includes(data.impactLevel.toUpperCase())) return res.status(400).send({ message: 'impactLevel can only have one of these values HIGH, MEDIUM or LOW' })
        if (isNaN(data.yearsTrajectory)) return res.status(400).send({ message: 'yearsTrajectory has to be a number' })
        let enterprise = await Enterprise.findOneAndUpdate({ _id: id }, data, { new: true })
        if (!enterprise) return res.status(404).send({ message: 'Enterprise not found not updated' })
        return res.send({ message: 'Enterprise updated successfully', enterprise })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating enterprise' })
    }
}

export const getEnterprises = async (req, res) => {
    try {
        let enterprises = await Enterprise.find({})
        if (!enterprises) return res.status(404).send({ message: 'Enterprises not found' })
        return res.send({ message: 'Enterprises found', enterprises })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting enterprises' })
    }
}

export const enterprisesOrderYearsASC = async (req, res) => {
    try {
        let enterprises = await Enterprise.find({}).sort({ yearsTrajectory: 1 })
        if (!enterprises) return res.status(404).send({ message: 'Enterprises not found' })
        return res.send({ message: 'Enterprises found', enterprises })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting enterprises' })
    }
}

export const enterprisesOrderYearsDESC = async (req, res) => {
    try {
        let enterprises = await Enterprise.find({}).sort({ yearsTrajectory: -1 })
        if (!enterprises) return res.status(404).send({ message: 'Enterprises not found' })
        return res.send({ message: 'Enterprises found', enterprises })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting enterprises' })
    }
}

export const enterprisesOrderA_Z = async (req, res) => {
    try {
        let enterprises = await Enterprise.find({}).sort({ name: 1 })
        if (!enterprises) return res.status(404).send({ message: 'Enterprises not found' })
        return res.send({ message: 'Enterprises found', enterprises })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting enterprises' })
    }
}

export const enterprisesOrderZ_A = async (req, res) => {
    try {
        let enterprises = await Enterprise.find({}).sort({ name: -1 })
        if (!enterprises) return res.status(404).send({ message: 'Enterprises not found' })
        return res.send({ message: 'Enterprises found', enterprises })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting enterprises' })
    }
}