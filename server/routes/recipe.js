import express from "express";
import db from "../db/connection.js";

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
};

router.post("/generate-recipes", isAuthenticated, async (req, res) => {
  try {
    // Get user's fridge items
    const ingredientsCollection = db.collection("ingredients");
    const fridge = await ingredientsCollection.find({ 
      userId: req.user._id.toString(),
      location: "fridge" 
    }).toArray();
    
    const pantry = await ingredientsCollection.find({ 
      userId: req.user._id.toString(),
      location: "pantry" 
    }).toArray();

    // Get user's profile/preferences
    const profilesCollection = db.collection("profiles");
    const profile = await profilesCollection.findOne({ 
      userId: req.user._id.toString() 
    });

    // Format data for Flask
    const fridgeData = fridge.map(item => ({
      item: item.ingredient_name,
      expiration: item.ingredient_date,
      quantity: item.ingredient_quantity
    }));

    const pantryData = pantry.map(item => item.ingredient_name);

    // Call Flask API
    const flaskResponse = await fetch('http://localhost:5001/generate-recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fridge: fridgeData,
        pantry: pantryData,
        dietaryRestrictions: profile?.dietary_restrictions || [],
        preferences: profile?.preferences || ''
      })
    });

    if (!flaskResponse.ok) {
      const errorText = await flaskResponse.text();
      throw new Error(`Flask API error: ${flaskResponse.status} - ${errorText}`);
    }

    const recipes = await flaskResponse.json();
    res.status(200).json(recipes);

  } catch (err) {
    console.error("Error generating recipes:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;