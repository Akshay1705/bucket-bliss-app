const express = require('express');
const mongoose = require('mongoose');
const Wish = require('./models/Wish');
require('dotenv').config(); // Load env vars
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

app.use("/api/auth", authRoutes);

// Connect MongoDB (local Compass)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB (local) connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

/* 
===================================================
📌 ROUTES
===================================================
*/

// ✅ GET all wishes (with optional filtering by category/status)
app.get("/api/wishes", async (req, res) => {
  try {
    const { category, status } = req.query;

    // Build dynamic filter object
    const filter = {};

    if (category) {
      filter.category = { $regex: new RegExp(category, "i") }; // case-insensitive
    }

    if (status) {
      if (status.toLowerCase() === "completed") {
        filter.isCompleted = true;
      } else if (status.toLowerCase() === "pending") {
        filter.isCompleted = false;
      }
    }

    const wishes = await Wish.find(filter).sort({ createdAt: -1 });

    return res.status(200).json(wishes);
  } catch (error) {
    console.error("GET /wishes error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ POST a new wish
app.post('/api/wishes', async(req, res) => {
  try {
    const { title, category, targetDate } = req.body;

    // 🔒 Validate inputs
    if (!title || !category || !targetDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newWish = await Wish.create({
      title,
      category,
      targetDate
    });

    return res.status(201).json({
      message: 'Wish added successfully',
      wish: newWish
    });
  } catch (error) {
    console.error('POST /wishes error:', error);
    return res.status(500).json({ error: 'Failed to create wish' });
  }
});

// ✅ PUT (update) a wish by ID
app.put("/api/wishes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, targetDate, isCompleted } = req.body;

    const updatedWish = await Wish.findByIdAndUpdate(
      id,
      {
        ...(title !== undefined && { title }),
        ...(category !== undefined && { category }),
        ...(targetDate !== undefined && { targetDate }),
        ...(isCompleted !== undefined && { isCompleted }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedWish) {
      return res.status(404).json({ error: "Wish not found" });
    }

    return res.status(200).json({
      message: "Wish updated successfully",
      wish: updatedWish,
    });
  } catch (error) {
    console.error("PUT /wishes/:id error:", error);
    return res.status(500).json({ error: "Failed to update wish" });
  }
});


// ✅ DELETE a wish by ID
app.delete("/api/wishes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedWish = await Wish.findByIdAndDelete(id);

    if (!deletedWish) {
      return res.status(404).json({ error: "Wish not found" });
    }

    return res.status(200).json({ message: "Wish deleted successfully" });
  } catch (error) {
    console.error("DELETE /wishes/:id error:", error);
    return res.status(500).json({ error: "Failed to delete wish" });
  }
});

/* 
===================================================
🚀 Start the server
===================================================
*/
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
