const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const createToken = async (email, username) => {
    const base64 = Buffer.from(`${email}:${username}`).toString('base64')
    return jwt.sign({ data: base64 }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

const verifyToken = async (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

const decodedBase64 = (token) => {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [email, username] = decoded.split(':')
    return { email, username }
}

const hashPassword = async (password) => {
    return bcrypt.hash(password, 10)
}

const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}

module.exports = { 
    hashPassword,
    comparePassword,
    createToken,
    verifyToken,
    decodedBase64
}