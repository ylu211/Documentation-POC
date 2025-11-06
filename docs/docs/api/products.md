---
id: products
title: Module Products
sidebar_label: products
---

# Module products

## Vue d'ensemble

| Méthode | Route | Description |
|---------|-------|-------------|
| 📖 **GET** | `/api/products` | Ce endpoint retourne la liste des produits disponibles, fournissant ainsi un aperçu global des articles offerts par l'entreprise. |
| ➕ **POST** | `/api/products` | Ce endpoint permet d'ajouter un nouveau produit dans la base de données, en recevant les informations du nouveau produit (par exemple : nom, description, prix, etc.) dans le corps de la requête POST. |

---

## 📖 GET /api/products

**Description:** Ce endpoint retourne la liste des produits disponibles, fournissant ainsi un aperçu global des articles offerts par l'entreprise.

**Flux d'exécution:**

```mermaid
sequenceDiagram
  actor Client
  participant API
  participant Controller
  participant Service
  participant DB as Database

  Client ->> API: GET /api/products
  API ->> Controller: Traiter requête
  Controller ->> Service: Logique métier
  Service ->> DB: Accès données
  DB -->> Service: Résultat
  Service -->> Controller: Données
  Controller -->> API: Réponse
  API -->> Client: 200 Success
```

---

## ➕ POST /api/products

**Description:** Ce endpoint permet d'ajouter un nouveau produit dans la base de données, en recevant les informations du nouveau produit (par exemple : nom, description, prix, etc.) dans le corps de la requête POST.

**Flux d'exécution:**

```mermaid
sequenceDiagram
  actor Client
  participant API
  participant Controller
  participant Service
  participant Validator
  participant DB as Database

  Client ->> API: POST /api/products
  API ->> Validator: Valider données
  Validator -->> API: ✅ OK
  API ->> Controller: Traiter requête
  Controller ->> Service: Logique métier
  Service ->> DB: Accès données
  DB -->> Service: Résultat
  Service -->> Controller: Données
  Controller -->> API: Réponse
  API -->> Client: 200 Success
```

---

