// backend/routes/user.route.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Récupère un utilisateur par son identifiant
 *     description: Permet de rechercher un utilisateur spécifique en utilisant son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant unique de l'utilisateur.
 *     responses:
 *       200:
 *         description: Un utilisateur trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       404:
 *         description: L'utilisateur n'a pas été trouvé.
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - User
 *     summary: Récupère la liste de tous les utilisateurs
 *     description: Permet de récupérer une liste complète des utilisateurs enregistrés.
 *     responses:
 *       200:
 *         description: Une liste d'utilisateurs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 */
const logMiddleware = (req, res, next) => {
  console.log('Middleware: Requête reçue.');
  next();
};

router.get('/', logMiddleware, userController.getUsers);

module.exports = router;
