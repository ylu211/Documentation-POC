// backend/services/user.service.js

exports.getAllUsers = () => {
  console.log('Service: Récupération de tous les utilisateurs depuis la base de données.');
  return {
    message: 'Données de tous les utilisateurs'
  };
};

exports.getUserById = (id) => {
  console.log(`Service: Récupération de l'utilisateur avec l'ID ${id}.`);
  return {
    message: `Données de l'utilisateur avec l'ID ${id}`
  };
};

exports.createUser = (userData) => {
  console.log('Service: Création d\'un nouvel utilisateur.');
  return {
    message: `Utilisateur créé : ${JSON.stringify(userData)}`
  };
};