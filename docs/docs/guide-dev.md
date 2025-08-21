# Guide d'utilisation de l'API Produits

Ce guide pratique vous explique comment interagir avec l'API des produits pour récupérer et créer de nouveaux produits.

## 1. Récupérer tous les produits

Pour obtenir la liste complète des produits, utilisez la méthode `GET` sur l'endpoint `/api/products`.

### Exemple de code

```javascript
// Exemple avec le client JavaScript 'fetch'
fetch('localhost:5001/api/products](localhost:5001/api/products)')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erreur:', error));
```

## 2. Créer un nouveau produit
Pour ajouter un nouveau produit à la base de données, envoyez une requête POST à l'endpoint /api/products avec les informations du produit dans le corps de la requête.

Corps de la requête (JSON)
Votre requête doit inclure un objet JSON avec les propriétés suivantes :

name (string) : Nom du produit.

price (number) : Prix du produit.

description (string) : Description du produit.

```javascript
const nouveauProduit = {
  name: "Montre connectée",
  price: 199.99,
  description: "Une montre qui vous aide à rester en forme."
};

fetch('[localhost:5001/api/products](localhost:5001/api/products)', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(nouveauProduit),
})
  .then(response => response.json())
  .then(data => console.log('Produit créé avec succès:', data))
  .catch((error) => console.error('Erreur:', error));
```