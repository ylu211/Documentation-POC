// backend/services/product.service.js

exports.getAllProducts = () => {
  // Logique pour interroger la base de données
  console.log('Service Layer: Fetching all products from the database.');
  return 'Data from the database';
};

exports.createProduct = (productData) => {
  // Logique pour valider et insérer des données dans la base de données
  console.log('Service Layer: Creating a new product in the database.');
  return `New product created: ${JSON.stringify(productData)}`;
};