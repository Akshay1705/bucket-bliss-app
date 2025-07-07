// index.js
// import express, { json } from 'express'; <--also this vaild 
const express = require('express');
const app = express();//Initializes Express server
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());//Lets the server understand JSON bodies

// Sample route
app.get('/api/wishes', (req, res) => {//Defines a route that responds to GET requests
  res.json({ message: 'Welcome to Bucket Bliss – Wishlist API!' });//Sends back a JSON response
});

// Start server
app.listen(PORT, () => {//Starts the server on a specific port
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

