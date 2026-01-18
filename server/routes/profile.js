import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get user profile
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("profiles");
    let result = await collection.findOne({});
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching profile");
  }
});

// Create new profile
router.post("/", async (req, res) => {
  try {
    let newProfile = {
      username: req.body.username,
      dietary_restrictions: req.body.dietary_restrictions,
      preferences: req.body.preferences,
    };
    let collection = await db.collection("profiles");
    let result = await collection.insertOne(newProfile);
    res.send(result).status(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating profile");
  }
});

// Update profile
router.patch("/", async (req, res) => {
  try {
    const updates = {
      $set: {
        username: req.body.username,
        dietary_restrictions: req.body.dietary_restrictions,
        preferences: req.body.preferences,
      }
    };
    let collection = await db.collection("profiles");
    let result = await collection.updateOne({}, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating profile");
  }
});

export default router;