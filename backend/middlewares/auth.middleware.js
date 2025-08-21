// backend/middlewares/auth.middleware.js

exports.checkAuth = (req, res, next) => {
  // Logique de vérification d'un token JWT ou d'une clé d'API
  console.log('Middleware: Checking authentication...');
  
  // Dans un cas réel, vous vérifieriez le token
  const isAuthenticated = true; // Simuler une vérification réussie
  
  if (isAuthenticated) {
    console.log('Middleware: Authentication successful.');
    next(); // Passer au contrôleur suivant
  } else {
    res.status(401).send('Unauthorized');
  }
};