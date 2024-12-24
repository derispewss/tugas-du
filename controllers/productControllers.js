const prisma = require('../db/prisma')

exports.getAllProducts = async (req, res) => {
    const { id } = req.params
    try {
        if (id) {
            const product = await prisma.product.findUnique({
                where: {
                    id: parseInt(id)
                },
                select: {
                    id: true,
                    productName: true,
                    category: true,
                    description: true,
                    stock: true,
                    image: true,
                    price: true,
                    createdAt: true,
                    updatedAt: true,
                    status: true
                }
            })
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' })
            }
            res.status(200).json({ success: true, data: product })
        } else {
            const products = await prisma.product.findMany()
            if (products.length === 0) {
                return res.status(404).json({ success: false, message: 'No products found' })
            }
            res.status(200).json({ success: true, data: products })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.addProducts = async (req, res) => {
    const { productName, category, price, description, stock, image } = req.body
    if (!productName || !category || !price) {
        return res.status(400).json({ success: false, message: 'Category, ProductName and price are required' })
    }
    try {
        const product = await prisma.product.create({
            data: {
                productName,
                category,
                price: parseInt(price),
                description: description || '',
                stock: stock || 0,
                image: image || '',
                status: true,
                createdAt: Math.floor(Date.now() / 1000)
            }
        })
        res.status(201).json({ success: true, message: 'Product created successfully', data: product })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

exports.updateProduct = async (req, res) => {
    const { id } = req.params
    if(!id) {
        return res.status(400).json({ success: false, message: 'Product id is required' })
    }
    const { productName, price, category, description, stock, image, status } = req.body
    try {
        const existingProduct = await prisma.product.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' })
        }
        const product = await prisma.product.update({
            where: {
                id: parseInt(id)
            },
            data: {
                productName: productName || existingProduct.productName,
                price: price || existingProduct.price,
                category: category || existingProduct.category,
                description: description || existingProduct.description,
                stock: stock || existingProduct.stock,
                image: image || existingProduct.image,
                status: status !== undefined ? status : existingProduct.status,
                updatedAt: Math.floor(Date.now() / 1000)
            }
        })
        res.status(200).json({ success: true, message: 'Product updated successfully', data: product })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

exports.deleteProduct = async (req, res) => {
    const { id } = req.params
    try {
        const existingProduct = await prisma.product.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' })
        }
        await prisma.product.delete({
            where: {
                id: parseInt(id)
            }
        })
        const updateQuery = `
            UPDATE user
            SET id = id - 1
            WHERE id > ${parseInt(id)};
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
        res.status(200).json({ success: true, message: 'Product deleted successfully' })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}