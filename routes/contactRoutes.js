const express = require("express");
const router = express.Router();
const Contact = require("../models/contactModel.js");

router.post("/post", async (req, res) => {
    try {
        const { name, email, mobile, message } = req.body;

        if (!name || !email || !mobile || !message) return res.status(400).json({ message: "All fields are required." });

        const contact = new Contact({ name, email, mobile, message });
        await contact.save();

        res.status(200).json({ data: contact, message: "Thanks for contacting us!, we will get back to you." });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit contact form", error: error.message });
    };
});

module.exports = router;