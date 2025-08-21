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
  GET_product_715(("GET product/"))
end

subgraph Logic
  Controller_controller.getProducts_0[/controller.getProducts/]
end

subgraph Data Layer
  database_product[/Database/]
end

  Client --> GET_product_715
  GET_product_715 --> Controller_controller.getProducts_0
  Controller_controller.getProducts_0 --> database_product

  class GET_product_715 GET;
  class Controller_controller.getProducts_0 LAYER;

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
  POST_product_758(("POST product/"))
end

subgraph Logic
  Controller_controller.createProduct_0[/controller.createProduct/]
end

subgraph Data Layer
  database_product[/Database/]
end

  Client --> POST_product_758
  POST_product_758 --> Controller_controller.createProduct_0
  Controller_controller.createProduct_0 --> database_product

  class POST_product_758 POST;
  class Controller_controller.createProduct_0 LAYER;

```

