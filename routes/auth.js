const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authControllers');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Endpoint untuk autentikasi pengguna
 * 
 * /api/auth/login:
 *   post:
 *     summary: Login pengguna
 *     description: Endpoint untuk login pengguna dengan email atau username dan password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               username:
 *                 type: string
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login Successfully"
 *                 token:
 *                   type: string
 *                   example: "jwt.token.string"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     username:
 *                       type: string
 *                       example: "user123"
 *       400:
 *         description: Data tidak lengkap
 *       401:
 *         description: Kredensial tidak valid
 *       500:
 *         description: Error server
 * 
 * /api/auth/register:
 *   post:
 *     summary: Registrasi pengguna
 *     description: Endpoint untuk mendaftarkan pengguna baru
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user123"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *       400:
 *         description: Data tidak lengkap atau pengguna sudah ada
 *       500:
 *         description: Error server
 */

router.post('/auth/login', login);
router.post('/auth/register', register);

module.exports = router;
