const redis = require('redis');
const nodemailer = require('nodemailer');
const axios = require('axios');

const client = redis.createClient();
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

class ProductService {
  constructor() {
    this.products = [
      { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'electronics' },
      { id: 2, name: 'T-Shirt', price: 29.99, category: 'clothing' }
    ];
  }

  async findAll() {
    // Tentative de récupération depuis le cache Redis
    try {
      const cached = await client.get('products:all');
      if (cached) {
        console.log('📦 Données récupérées depuis le cache');
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('⚠️ Cache Redis indisponible');
    }

    // Simulation requête base de données
    const products = this.products;
    
    // Mise en cache des résultats
    try {
      await client.setex('products:all', 300, JSON.stringify(products));
      console.log('💾 Données mises en cache');
    } catch (error) {
      console.warn('⚠️ Impossible de mettre en cache');
    }

    return products;
  }

  async create(productData) {
    // Vérification de prix externe (API de vérification)
    try {
      console.log('🌍 Vérification des prix via API externe...');
      const priceCheckResponse = await axios.get(`https://api.pricecheck.com/verify`, {
        params: { category: productData.category, price: productData.price }
      });
      
      if (!priceCheckResponse.data.valid) {
        throw new Error('Prix non conforme au marché');
      }
    } catch (error) {
      console.warn('⚠️ Vérification prix externe échouée, continuation...');
    }

    // Création du produit
    const newProduct = {
      id: this.products.length + 1,
      ...productData,
      createdAt: new Date().toISOString()
    };

    this.products.push(newProduct);

    // Invalidation du cache
    try {
      await client.del('products:all');
      console.log('🗑️ Cache invalidé');
    } catch (error) {
      console.warn('⚠️ Impossible d\'invalider le cache');
    }

    // Envoi d'email de notification
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'admin@company.com',
        subject: '🎉 Nouveau produit créé',
        html: `
          <h2>Nouveau produit ajouté</h2>
          <p><strong>Nom:</strong> ${newProduct.name}</p>
          <p><strong>Prix:</strong> ${newProduct.price}€</p>
          <p><strong>Catégorie:</strong> ${newProduct.category}</p>
        `
      });
      console.log('📧 Email de notification envoyé');
    } catch (error) {
      console.warn('⚠️ Échec envoi email:', error.message);
    }

    return newProduct;
  }
}

module.exports = new ProductService();