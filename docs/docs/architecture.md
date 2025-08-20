# Architecture de l'API

Cette page est générée automatiquement à partir du code source du projet. Elle présente les principaux diagrammes d'architecture, assurant ainsi une documentation toujours à jour.

---

## Diagramme du service : Product - Route GET /

```mermaid
graph LR

classDef GET fill:#4caf50,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef POST fill:#2196f3,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef PUT fill:#ff9800,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef DELETE fill:#f44346,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef LAYER fill:#b3e5fc,stroke:#333,stroke-width:1px,color:#333;


subgraph Endpoints
  GET_product_378(("GET product/"))
end

subgraph Logic
  Middleware_authMiddleware.checkAuth_0[/authMiddleware.checkAuth/]
  Controller_productController.getProducts_1[/productController.getProducts/]
end

subgraph Data Layer
  database_product[/Database/]
end

  Client --> GET_product_378
  GET_product_378 --> Middleware_authMiddleware.checkAuth_0
  Middleware_authMiddleware.checkAuth_0 --> Controller_productController.getProducts_1
  Controller_productController.getProducts_1 --> database_product

  class GET_product_378 GET;
  class Middleware_authMiddleware.checkAuth_0,Controller_productController.getProducts_1 LAYER;

```

## Diagramme du service : Product - Route POST /

```mermaid
graph LR

classDef GET fill:#4caf50,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef POST fill:#2196f3,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef PUT fill:#ff9800,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef DELETE fill:#f44346,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef LAYER fill:#b3e5fc,stroke:#333,stroke-width:1px,color:#333;


subgraph Endpoints
  POST_product_455(("POST product/"))
end

subgraph Logic
  Middleware_authMiddleware.checkAuth_0[/authMiddleware.checkAuth/]
  Controller_productController.createProduct_1[/productController.createProduct/]
end

subgraph Data Layer
  database_product[/Database/]
end

  Client --> POST_product_455
  POST_product_455 --> Middleware_authMiddleware.checkAuth_0
  Middleware_authMiddleware.checkAuth_0 --> Controller_productController.createProduct_1
  Controller_productController.createProduct_1 --> database_product

  class POST_product_455 POST;
  class Middleware_authMiddleware.checkAuth_0,Controller_productController.createProduct_1 LAYER;

```

## Diagramme du service : User - Route GET /:id

```mermaid
graph LR

classDef GET fill:#4caf50,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef POST fill:#2196f3,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef PUT fill:#ff9800,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef DELETE fill:#f44346,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef LAYER fill:#b3e5fc,stroke:#333,stroke-width:1px,color:#333;


subgraph Endpoints
  GET_user_272(("GET user/:id"))
end

subgraph Logic
  Controller_userController.getUserById_0[/userController.getUserById/]
end

subgraph Data Layer
  database_user[/Database/]
end

  Client --> GET_user_272
  GET_user_272 --> Controller_userController.getUserById_0
  Controller_userController.getUserById_0 --> database_user

  class GET_user_272 GET;
  class Controller_userController.getUserById_0 LAYER;

```

## Diagramme du service : User - Route GET /

```mermaid
graph LR

classDef GET fill:#4caf50,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef POST fill:#2196f3,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef PUT fill:#ff9800,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef DELETE fill:#f44346,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef LAYER fill:#b3e5fc,stroke:#333,stroke-width:1px,color:#333;


subgraph Endpoints
  GET_user_476(("GET user/"))
end

subgraph Logic
  Middleware_logMiddleware_0[/logMiddleware/]
  Controller_userController.getUsers_1[/userController.getUsers/]
end

subgraph Data Layer
  database_user[/Database/]
end

  Client --> GET_user_476
  GET_user_476 --> Middleware_logMiddleware_0
  Middleware_logMiddleware_0 --> Controller_userController.getUsers_1
  Controller_userController.getUsers_1 --> database_user

  class GET_user_476 GET;
  class Middleware_logMiddleware_0,Controller_userController.getUsers_1 LAYER;

```

