const prisma = require('../db/prisma.js')
require('dotenv').config()

exports.getAllUsers = async (req, res) => {
    await prisma.user.findMany({
        select: {   
            username: true,
            email: true,
            createdAt: true,
            updatedAt: true
        }
    })
    .then(users => {
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'No users found' })
        }
        res.status(200).json({ sucess: true, data: [users] })
    })
    .catch(err => {
        res.status(500).json({ error: err.message })
    })
}

exports.updateUsers = async (req, res) => {
    const { id } = req.params
    const { username } = req.body
    if (!id) {
        return res.status(400).json({ success: false, message: 'Id is required' })
    }
    if (!username) {
        return res.status(400).json({ success: false, message: 'Username is required' })
    }
    const updateId = parseInt(id);
    try {
        const user = await prisma.user.findUnique({
            where: { 
                id: updateId 
            }
        });
        if(!user) {
            return res.status(404).json({ success: false, message: `User with id ${id} not found` })
        }
        await prisma.user.update({
            where: { 
                id: updateId, 
            },
            data: {
                username: username,
                email: user.email,
                updatedAt: Math.floor(Date.now() / 1000)
            }
        });
        res.status(200).json({ success: true, message: `User with id ${id} has been updated` })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

exports.deleteUsers = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: 'Id is required' });
    }
    const deleteId = parseInt(id);
    try {
        const userExists = await prisma.user.findUnique({
            where: { id: deleteId },
        });
        if (!userExists) {
            return res.status(404).json({ success: false, message: `User with id ${deleteId} not found` });
        }
        await prisma.user.delete({
            where: {
                id: deleteId 
            },
        });
        const updateQuery = `
            UPDATE user
            SET id = id - 1
            WHERE id > ${deleteId};
        `;
        await prisma.$executeRawUnsafe(updateQuery);
        const maxIdResult = await prisma.user.findMany({
            select: { id: true },
            orderBy: { id: 'desc' },
            take: 1,
        });
        const maxId = maxIdResult.length > 0 ? maxIdResult[0].id : 0;
        const resetAutoIncrementQuery = `
            ALTER TABLE user AUTO_INCREMENT = ${maxId + 1};
        `;
        await prisma.$executeRawUnsafe(resetAutoIncrementQuery);
        res.status(200).json({
            success: true,
            message: `User with id ${deleteId} has been deleted.`,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
