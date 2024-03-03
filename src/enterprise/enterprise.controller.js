'use strict'

import Enterprise from '../enterprise/enterprise.model.js'
import xlsx from 'xlsx-populate'

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

export const enterprisesByCategory = async (req, res) => {
    try {
        let { category } = req.body
        let enterprises = await Enterprise.find({ category: category })
        if (!enterprises) return res.status(404).send({ message: 'Enterprises not found' })
        return res.send({ message: 'Enterprises found', enterprises })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting enterprises' })
    }
}

export const enterprisesByImpactLevelDESC = async (req, res) => {
    try {
        let enterprises = await Enterprise.find({})
        if (!enterprises) return res.status(404).send({ message: 'Enterprises not found' })

        enterprises.sort((a, b) => {
            const order = { HIGH: 3, MEDIUM: 2, LOW: 1 }
            return order[b.impactLevel] - order[a.impactLevel]
        })

        return res.send({ message: 'Enterprises found', enterprises })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting enterprises' })
    }
}

export const enterprisesByImpactLevelASC = async (req, res) => {
    try {
        let enterprises = await Enterprise.find({})
        if (!enterprises) return res.status(404).send({ message: 'Enterprises not found' })

        enterprises.sort((a, b) => {
            const order = { HIGH: 1, MEDIUM: 2, LOW: 3 }
            return order[b.impactLevel] - order[a.impactLevel]
        })

        return res.send({ message: 'Enterprises found', enterprises })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting enterprises' })
    }
}

export const generateReport = async (req, res) => {
    try {
        let enterprises = await Enterprise.find({})
        if (!enterprises) return res.status(404).send({ message: 'Enterprises not found' })

        const workbook = await xlsx.fromBlankAsync()
        const sheet = workbook.sheet(0)
        sheet.cell('A1').value('ID')
        sheet.cell('B1').value('Name')
        sheet.cell('C1').value('Address')
        sheet.cell('D1').value('Impact Level')
        sheet.cell('E1').value('Years Trajectory')
        sheet.cell('F1').value('Category')

        let i = 2
        for (const enterprise of enterprises) {
            sheet.cell(`A${i}`).value(enterprise._id.toString())
            sheet.cell(`B${i}`).value(enterprise.name)
            sheet.cell(`C${i}`).value(enterprise.address)
            sheet.cell(`D${i}`).value(enterprise.impactLevel)
            sheet.cell(`E${i}`).value(enterprise.yearsTrajectory)
            sheet.cell(`F${i}`).value(enterprise.category)
            i++
        }
        await workbook.toFileAsync('Enterprises Report.xlsx')
        return res.send({ message: 'Report created succesfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error creating report' })
    }
}