const express = require('express');
const router = express.Router();
const { addProducts, getAllProducts, updateProduct, deleteProduct } = require('../controllers/productControllers');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints untuk manajemen produk
 * 
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Mengambil semua produk
 *     description: Endpoint untuk mengambil semua produk yang tersedia
 *     responses:
 *       200:
 *         description: Daftar produk berhasil diambil
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
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       productName:
 *                         type: string
 *                         example: "Product A"
 *                       category:
 *                         type: string
 *                         example: "Category 1"
 *                       description:
 *                         type: string
 *                         example: "Description of Product A"
 *                       stock:
 *                         type: integer
 *                         example: 10
 *                       price:
 *                         type: integer
 *                         example: 10000
 *                       image:
 *                         type: string
 *                         example: "image_url.jpg"
 *                       createdAt:
 *                         type: integer
 *                         example: 1640995200
 *                       updatedAt:
 *                         type: integer
 *                         example: 1640995200
 *                       status:
 *                         type: boolean
 *                         example: true
 *       404:
 *         description: Tidak ada produk ditemukan
 *       500:
 *         description: Error server
 *
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Mengambil produk berdasarkan ID
 *     description: Endpoint untuk mengambil produk berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID produk yang ingin diambil
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Produk berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     productName:
 *                       type: string
 *                       example: "Product A"
 *                     category:
 *                       type: string
 *                       example: "Category 1"
 *                     description:
 *                       type: string
 *                       example: "Description of Product A"
 *                     stock:
 *                       type: integer
 *                       example: 10
 *                     price:
 *                       type: integer
 *                       example: 10000
 *                     image:
 *                       type: string
 *                       example: "image_url.jpg"
 *                     createdAt:
 *                       type: integer
 *                       example: 1640995200
 *                     updatedAt:
 *                       type: integer
 *                       example: 1640995200
 *                     status:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Produk tidak ditemukan
 *       500:
 *         description: Error server
 * 
 * /api/products/create:
 *   post:
 *     tags: [Products]
 *     summary: Menambahkan produk baru
 *     description: Endpoint untuk menambahkan produk baru
 *     parameters:
 *       - in: body
 *         name: product
 *         description: Data produk yang akan ditambahkan
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             productName:
 *               type: string
 *               example: "Product A"
 *             category:
 *               type: string
 *               example: "Category 1"
 *             price:
 *               type: integer
 *               example: 10000
 *             description:
 *               type: string
 *               example: "Description of Product A"
 *             stock:
 *               type: integer
 *               example: 10
 *             image:
 *               type: string
 *               example: "image_url.jpg"
 *     responses:
 *       201:
 *         description: Produk berhasil ditambahkan
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
 *                   example: "Product created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     productName:
 *                       type: string
 *                       example: "Product A"
 *       400:
 *         description: Data produk tidak lengkap
 *       500:
 *         description: Error server
 *
 * /api/products/update/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Memperbarui data produk
 *     description: Endpoint untuk memperbarui produk berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID produk yang ingin diperbarui
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: body
 *         name: product
 *         description: Data produk yang ingin diperbarui
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             productName:
 *               type: string
 *               example: "Updated Product"
 *             category:
 *               type: string
 *               example: "Category 2"
 *             price:
 *               type: integer
 *               example: 12000
 *             description:
 *               type: string
 *               example: "Updated description"
 *             stock:
 *               type: integer
 *               example: 15
 *             image:
 *               type: string
 *               example: "updated_image.jpg"
 *             status:
 *               type: boolean
 *               example: true
 *     responses:
 *       200:
 *         description: Produk berhasil diperbarui
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
 *                   example: "Product updated successfully"
 *       400:
 *         description: ID produk tidak ditemukan atau data tidak valid
 *       500:
 *         description: Error server
 *
 * /api/products/delete/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Menghapus produk
 *     description: Endpoint untuk menghapus produk berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID produk yang ingin dihapus
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 *       404:
 *         description: Produk tidak ditemukan
 *       500:
 *         description: Error server
 */
router.get('/products', getAllProducts);
router.get('/products/:id?', getAllProducts);
router.post('/products/create', authMiddleware, addProducts);
router.put('/products/update/:id', authMiddleware, updateProduct);
router.delete('/products/delete/:id', authMiddleware, deleteProduct);

module.exports = router;