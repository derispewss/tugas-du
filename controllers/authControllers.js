const prisma = require('../db/prisma.js')
const { verifyToken, comparePassword, createToken, hashPassword, decodedBase64 } = require('../functions/encodedDecoded.js');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Username, email, and password are required' });
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email or username already exists' });
        }
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                createdAt: Math.floor(Date.now() / 1000),
            },
        });
        res.status(201).json({  success: true, message: 'User registered successfully' });;
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, username, password } = req.body
        if ((!email && !username) || !password) {
            return res.status(400).json({ success: false, message: 'Email/username and password are required' })
        }
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email || '' },
                    { username: username || '' }
                ]
            }
        })
        if (!user) {
            return res.status(401).json({ success: false, message: `user with ${email || username} not found` })
        }
        const isPasswordValid = await comparePassword(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }
        const createTokens = await createToken(user.email, user.username);
        const updateUsers = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                token: createTokens
            }
        })
        const token = await verifyToken(updateUsers.token)
        const originalData = decodedBase64(token.data)
        res.status(200).json({ 
            success: true, 
            message: "Login Successfully",
            token: updateUsers.token,
            data: originalData 
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
}