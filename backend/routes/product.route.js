const express = require('express')
const router = express.Router()
const controller = require('../controllers/product.controller')

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: List of products
 *   post:
 *     summary: Create a product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created
 */
router.get('/', controller.getProducts)
router.post('/', controller.createProduct)

module.exports = router
