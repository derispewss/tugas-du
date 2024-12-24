const express = require('express')
const { getAllUsers, updateUsers, deleteUsers } = require('../controllers/usersControllers')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Endpoint untuk mengelola pengguna
 * 
 * /api/users:
 *   get:
 *     summary: Mendapatkan semua pengguna
 *     description: Endpoint untuk mengambil semua data pengguna
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Daftar pengguna ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         example: "johndoe"
 *                       email:
 *                         type: string
 *                         example: "johndoe@example.com"
 *                       createdAt:
 *                         type: string
 *                         example: "2023-12-24T12:34:56.789Z"
 *                       updatedAt:
 *                         type: string
 *                         example: "2023-12-24T12:34:56.789Z"
 *       404:
 *         description: Tidak ada pengguna ditemukan
 *       500:
 *         description: Error server
 * 
 * /api/users/update/{id}:
 *   put:
 *     summary: Memperbarui data pengguna
 *     description: Endpoint untuk memperbarui username pengguna berdasarkan ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pengguna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "newusername"
 *     responses:
 *       200:
 *         description: Pengguna berhasil diperbarui
 *       400:
 *         description: ID atau username tidak disediakan
 *       404:
 *         description: Pengguna tidak ditemukan
 *       500:
 *         description: Error server
 * 
 * /api/users/{id}:
 *   delete:
 *     summary: Menghapus pengguna
 *     description: Endpoint untuk menghapus pengguna berdasarkan ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pengguna
 *     responses:
 *       200:
 *         description: Pengguna berhasil dihapus
 *       400:
 *         description: ID tidak disediakan
 *       404:
 *         description: Pengguna tidak ditemukan
 *       500:
 *         description: Error server
 */
router.get('/users', getAllUsers)
router.put('/users/update/:id', updateUsers)
router.delete('/users/:id', deleteUsers)

module.exports = router