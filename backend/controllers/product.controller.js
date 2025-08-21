const productService = require('../services/product.service')

exports.getProducts = (req, res) => {
  res.json(productService.findAll())
}

exports.createProduct = (req, res) => {
  const created = productService.create(req.body)
  res.status(201).json(created)
}
