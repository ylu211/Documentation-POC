const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { validateProduct } = require('../middlewares/validation.middleware');

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupère la liste de tous les produits
 *     description: Endpoint simple qui retourne tous les produits avec mise en cache
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [electronics, clothing, books, home]
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Nombre maximum de résultats
 *     responses:
 *       200:
 *         description: Liste des produits récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *       500:
 *         description: Erreur interne du serveur
 *   post:
 *     summary: Crée un nouveau produit
 *     description: Endpoint complexe qui crée un produit avec validation, vérification externe, email et cache
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 description: Nom du produit
 *                 example: "MacBook Pro 16"
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Prix en euros
 *                 example: 2499.99
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Description détaillée du produit
 *                 example: "Ordinateur portable haute performance"
 *               category:
 *                 type: string
 *                 enum: [electronics, clothing, books, home]
 *                 description: Catégorie du produit
 *                 example: "electronics"
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *       400:
 *         description: Données de validation incorrectes
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *       500:
 *         description: Erreur interne du serveur
 */

// GET /products - Endpoint simple avec authentification et cache
router.get('/', authenticateToken, controller.getProducts);

// POST /products - Endpoint complexe avec authentification, validation, API externe et email
router.post('/', authenticateToken, validateProduct, controller.createProduct);

module.exports = router;
