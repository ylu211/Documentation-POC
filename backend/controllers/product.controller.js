const productService = require('../services/product.service');

exports.getProducts = async (req, res) => {
  try {
    const products = await productService.findAll();
    res.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const newProduct = await productService.create(req.body);
    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Produit créé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur interne du serveur'
    });
  }
};
