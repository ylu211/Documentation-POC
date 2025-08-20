const productService = require('../services/product.service');

exports.getProducts = (req, res) => {
  // Le contrôleur appelle le service pour récupérer les données
  const products = productService.getAllProducts();
  res.send(`Controller received data: ${products}`);
};

exports.createProduct = (req, res) => {
  // Le contrôleur appelle le service pour créer un produit
  const newProduct = productService.createProduct(req.body);
  res.send(`Controller received data: ${newProduct}`);
};

// Logique pour la route GET /:id
exports.getProductById = (req, res) => {
  // Logique pour récupérer un produit spécifique
  res.send(`Get product with ID ${req.params.id} from controller`);
};

// Logique pour la route PUT /:id
exports.updateProduct = (req, res) => {
  // Logique pour mettre à jour un produit spécifique
  res.send(`Update product with ID ${req.params.id} from controller`);
};

// Logique pour la route DELETE /:id
exports.deleteProduct = (req, res) => {
  // Logique pour supprimer un produit spécifique
  res.send(`Delete product with ID ${req.params.id} from controller`);
};