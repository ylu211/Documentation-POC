const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.route');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

app.use(express.json());
app.use('/api/users', userRoutes);

module.exports = app;
