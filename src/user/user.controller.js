'use strict'

import User from '../user/user.model.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

export const createUser = async (req, res) => {
    try {
        let data = req.body
        const required = ['name', 'surname', 'username', 'email', 'password']
        let missingData = required.filter(field => !data[field] || data[field].replaceAll(' ', '').length === 0)
        if (missingData.length > 0) return res.status(400).send({ message: `Missing required fields ${missingData.join(', ')}` })
        let user = await User.findOne({ $or: [{ username: data.username }, { email: data.email }] })
        if (user) return res.status(409).send({ message: 'Username or email not available' })
        data.password = await encrypt(data.password)
        user = new User(data)
        await user.save()
        return res.send({ message: 'User created successfully', user })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error creating user' })
    }
}


export const login = async (req, res) => {
    try {
        let { username, email, password } = req.body
        let user = await User.findOne({ $or: [{ username: username }, { email: email }] })
        if (user && await checkPassword(password, user.password)) {
            let userInfo = {
                uid: user._id,
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
            }
            let token = await generateJwt(userInfo)
            return res.send({
                message: `Welcome ${user.name}`,
                userInfo,
                token
            })
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Failed to login' })
    }
}

export const updateUser = async (req, res) => {
    try {
        let { _id } = req.user
        let { id } = req.params
        let data = req.body
        let user = await User.findOne({ _id: id })
        if (!user) return res.status(404).send({ message: 'User not found' })
        if (user._id.toString() === _id.toString()) {
            if(data.password) return res.status(400).send({message: 'Do not have enter a password'})
            let missingData = []
            for (let key in data) {
                if (data[key].replaceAll(' ', '').length === 0) {
                    missingData.push(key)
                }
            }
            if (missingData.length > 0) return res.status(400).send({ message: `Missing data ${missingData.join(', ')}` })
            let updateUser = await User.findOneAndUpdate({ _id: id }, data, { new: true })
            if (!updateUser) return res.status(404).send({ message: 'User not found not updated' })
            return res.send({ message: 'User updated successfully', updateUser })
        } else {
            return res.status(401).send({ message: 'Yor cannot edit this profile' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating user' })
    }
}

export const deleteUser = async (req, res) => {
    try {
        let { _id } = req.user
        let { id } = req.params
        let user = await User.findOne({ _id: id })
        if (!user) return res.status(404).send({ message: 'User not found' })
        if (user._id.toString() === _id.toString()) {
            let deleteUser = await User.findOneAndDelete({ _id: id })
            if (!deleteUser) return res.status(404).send({ message: 'User not found not deleted' })
            return res.send({ message: 'User deleted successfully', deleteUser })
        } else {
            return res.status(401).send({ message: 'You cannot delete this profile' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error deleting user' })
    }
}