// index.js
// import express, { json } from 'express'; <--also this vaild 
const express = require('express');
const app = express();//Initializes Express server
const PORT = 4000;

// Middleware to parse JSON
app.use(express.json());//Lets the server understand JSON bodies

let wishes = []; // temporary data store - It’s just an empty array in memory

// Sample route
app.get('/api/wishes', (req, res) => {//Defines a route that responds to GET requests
  res.json({ message: 'Welcome to Bucket Bliss – Wishlist API!' });//Sends back a JSON response
  // res.json(wishes);//Sends back a JSON response
});

app.post('/api/wishes', (req, res) => {
  const { title, category, targetDate } = req.body;

  // Validate input
  if (!title || !category || !targetDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newWish = {
    id: Date.now(), // Temporary ID
    title,
    category,
    targetDate,
    isCompleted: false
  };

  wishes.push(newWish);//acting like adding a row in a database.

  res.status(201).json({ message: 'Wish added successfully', wish: newWish });
});


//Starts the server on a specific port
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

