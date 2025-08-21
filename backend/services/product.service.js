const Product = require('../models/product.model')

class ProductService {
  constructor() {
    this.products = [
      new Product(1, "Laptop", 1200),
      new Product(2, "Phone", 800)
    ]
  }

  findAll() {
    return this.products
  }

  create(productDto) {
    const newProduct = new Product(
      this.products.length + 1,
      productDto.name,
      productDto.price
    )
    this.products.push(newProduct)
    return newProduct
  }
}

module.exports = new ProductService()
