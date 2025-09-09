const express = require('express');
const next = require('next');
const mongoose = require('mongoose');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medVault";

app.prepare().then(() => {
  const server = express();

  server.use(express.json());

  mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB server is healthy and connected'))
    .catch(err => console.log("MongoDB connection error:", err));

    server.get('/api/health', (req, res) => {
      res.status(200).json({ status: 'OK', message: 'Server is healthy' });
    });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`🚀 MedVault running on http://localhost:${PORT}`);
  });
});