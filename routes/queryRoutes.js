const express = require("express");
const router = express.Router();
const Query = require("../models/queryModel.js");

router.post("/post", async (req, res) => {
    try {
        const { name, message } = req.body;

        if (!name || !message) return res.status(400).json({ message: "All fields are required." });

        const query = new Query({ name, message });
        await query.save();

        res.status(200).json({ data: query, message: "Thanks for your'e query!, we will update it soon." });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit query", error: error.message });
    };
});

router.get("/get", async (req, res) => {
    try {
        const query = await Query.find().sort({ createdAt: -1 });
        res.status(200).json({ data: query, message: "Query's fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message, message: "Failed to fetch query's" });
    };
});

module.exports = router;