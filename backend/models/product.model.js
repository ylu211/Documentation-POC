class Product {
    constructor(id, name, price, category = 'general', status = 'active') {
      this.id = id;
      this.name = name;
      this.price = price;
      this.category = category;
      this.status = status;
      this.createdAt = new Date();
      this.updatedAt = new Date();
      this.description = null;
      this.createdBy = null;
      this.updatedBy = null;
      this.reason = null; // Pour les changements de statut
    }
  
    /**
     * Valide les données du produit
     */
    validate() {
      const errors = [];
  
      if (!this.name || this.name.trim().length < 2) {
        errors.push('Le nom doit contenir au moins 2 caractères');
      }
  
      if (!this.price || this.price < 0) {
        errors.push('Le prix doit être un nombre positif');
      }
  
      if (!this.category) {
        errors.push('La catégorie est obligatoire');
      }
  
      const validCategories = ['electronics', 'clothing', 'books', 'food', 'general'];
      if (!validCategories.includes(this.category)) {
        errors.push('Catégorie invalide');
      }
  
      const validStatuses = ['active', 'inactive', 'pending', 'deleted'];
      if (!validStatuses.includes(this.status)) {
        errors.push('Statut invalide');
      }
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  
    /**
     * Formate le prix pour l'affichage
     */
    getFormattedPrice() {
      return `${this.price.toFixed(2)}€`;
    }
  
    /**
     * Calcule l'âge du produit en jours
     */
    getAgeInDays() {
      const now = new Date();
      const created = new Date(this.createdAt);
      return Math.floor((now - created) / (1000 * 60 * 60 * 24));
    }
  
    /**
     * Vérifie si le produit est récent (moins de 30 jours)
     */
    isNew() {
      return this.getAgeInDays() <= 30;
    }
  
    /**
     * Vérifie si le produit est premium (prix > 1000€)
     */
    isPremium() {
      return this.price > 1000;
    }
  
    /**
     * Retourne une version publique du produit (sans données sensibles)
     */
    toPublicJSON() {
      return {
        id: this.id,
        name: this.name,
        price: this.price,
        formattedPrice: this.getFormattedPrice(),
        category: this.category,
        status: this.status,
        description: this.description,
        isNew: this.isNew(),
        isPremium: this.isPremium(),
        createdAt: this.createdAt
      };
    }
  
    /**
     * Retourne une version complète pour les admins
     */
    toAdminJSON() {
      return {
        ...this.toPublicJSON(),
        createdBy: this.createdBy,
        updatedBy: this.updatedBy,
        updatedAt: this.updatedAt,
        reason: this.reason,
        ageInDays: this.getAgeInDays()
      };
    }
  }
  
  module.exports = Product;