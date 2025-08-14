const mongoose = require('mongoose');
const app = require('./app');

const PORT = 5000;
const MONGO_URL = 'mongodb://mongo:27017/demo';

mongoose.connect(MONGO_URL)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
