import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
};

// Apply authentication to all routes
router.use(isAuthenticated);

// Get all ingredients for the logged-in user
router.get("/", async (req, res) => {
  try {
    let collection = db.collection("ingredients");
    let results = await collection.find({ userId: req.user._id.toString() }).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching ingredients");
  }
});

// Get all fridge ingredients for the logged-in user
router.get("/fridge", async (req, res) => {
  try {
    let collection = db.collection("ingredients");
    let results = await collection.find({ 
      userId: req.user._id.toString(),
      location: "fridge" 
    }).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching fridge items");
  }
});

// Get all pantry ingredients for the logged-in user
router.get("/pantry", async (req, res) => {
  try {
    let collection = db.collection("ingredients");
    let results = await collection.find({ 
      userId: req.user._id.toString(),
      location: "pantry" 
    }).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching pantry items");
  }
});

// Get a single ingredient by id (for the logged-in user only)
router.get("/:id", async (req, res) => {
  try {
    let collection = db.collection("ingredients");
    let query = { 
      _id: new ObjectId(req.params.id),
      userId: req.user._id.toString()
    };
    let result = await collection.findOne(query);

    if (!result) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching ingredient");
  }
});

// Create a new ingredient for the logged-in user
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      userId: req.user._id.toString(), // Add user ID
      location: req.body.location,
      ingredient_name: req.body.ingredient_name,
      ingredient_quantity: req.body.ingredient_quantity,
      ingredient_date: req.body.ingredient_date,
    };
    let collection = db.collection("ingredients");
    let result = await collection.insertOne(newDocument);
    res.status(201).send(result); // Changed to 201 (Created)
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding ingredient");
  }
});

// Update an ingredient by id (for the logged-in user only)
router.patch("/:id", async (req, res) => {
  try {
    const query = { 
      _id: new ObjectId(req.params.id),
      userId: req.user._id.toString() // Ensure user owns this ingredient
    };
    const updates = {
      $set: {
        location: req.body.location,
        ingredient_name: req.body.ingredient_name,
        ingredient_quantity: req.body.ingredient_quantity,
        ingredient_date: req.body.ingredient_date,
      },
    };

    let collection = db.collection("ingredients");
    let result = await collection.updateOne(query, updates);
    
    if (result.matchedCount === 0) {
      res.status(404).send("Ingredient not found or you don't have permission");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating ingredient");
  }
});

// Delete an ingredient (for the logged-in user only)
router.delete("/:id", async (req, res) => {
  try {
    const query = { 
      _id: new ObjectId(req.params.id),
      userId: req.user._id.toString() // Ensure user owns this ingredient
    };
    const collection = db.collection("ingredients");
    let result = await collection.deleteOne(query);
    
    if (result.deletedCount === 0) {
      res.status(404).send("Ingredient not found or you don't have permission");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting ingredient");
  }
});

export default router;