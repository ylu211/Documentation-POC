// backend/routes/product.route.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Product
 *     summary: Récupère la liste de tous les produits
 *     security:
 *       - BearerAuth: []
 *     description: Accès public, mais l'authentification est requise pour la démonstration.
 *     responses:
 *       200:
 *         description: Une liste de produits.
 *       401:
 *         description: Authentification requise.
 */
router.get('/', authMiddleware.checkAuth, productController.getProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - Product
 *     summary: Crée un nouveau produit
 *     security:
 *       - BearerAuth: []
 *     description: Crée un produit avec les données fournies.
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
 *         description: Le produit a été créé avec succès.
 *       401:
 *         description: Authentification requise.
 */
router.post('/', authMiddleware.checkAuth, productController.createProduct);

module.exports = router;
