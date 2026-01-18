import express from "express";

const router = express.Router();

// Generate recipes using Python LLM
router.post("/generate-recipes", async (req, res) => {
  try {
    const { fridge, pantry, dietaryRestrictions, preferences } = req.body;
    
    console.log("Received request to generate recipes");
    
    // Call Python Flask server
    const response = await fetch("http://localhost:5001/generate-recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fridge: fridge || [],
        pantry: pantry || [],
        dietary_restrictions: dietaryRestrictions || [],
        preferences: preferences || ""
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Python server error: ${response.status} - ${errorText}`);  // <-- FIXED THIS LINE
    }

    const recipes = await response.json();
    console.log("Successfully generated recipes");
    res.status(200).json(recipes);
    
  } catch (err) {
    console.error("Error generating recipes:", err);
    res.status(500).json({ error: err.message || "Failed to generate recipes" });
  }
});

export default router;