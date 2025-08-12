const express = require("express");
const router = express.Router();
const Contact = require("../models/contactModel.js");
const MovieSeries = require("../models/msModel.js");

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

router.get("/get", async (req, res) => {
    try {
        const { search, format, industry, genre, watched, skip = 0, limit = 20 } = req.query;
        const filter = {};

        if (search) filter.msName = { $regex: new RegExp(escapeRegex(search), "i") };
        if (format) filter.msFormat = { $regex: new RegExp(`^${escapeRegex(format)}$`, "i") };
        if (industry) filter.msIndustry = { $regex: new RegExp(`^${escapeRegex(industry)}$`, "i") };
        if (genre) filter.msGenre = { $in: [new RegExp(`^${escapeRegex(genre)}$`, "i")] };
        if (watched === "true") filter.msWatched = true;
        else if (watched === "false") filter.msWatched = false;

        if (process.env.NODE_ENV === "production") {
            filter.msGenre = {
                ...(filter.msGenre || {}),
                $not: { $in: [/^18\+$/i, /hard romance/i] }
            };
        };

        const skipNum = parseInt(skip);
        const limitNum = parseInt(limit);

        const data = await MovieSeries.find(filter).sort({ msReleaseDate: -1 }).skip(skipNum).limit(limitNum).select("-_id -msLink -msFormat -msIndustry -msWatched -msWatchedAt -msUploadedBy ").lean();

        const get = data.reduce((acc, item) => {
            const year = new Date(item.msReleaseDate).getFullYear();
            if (!acc[year]) acc[year] = [];
            acc[year].push(item);
            return acc;
        }, {});

        const totalDocs = await MovieSeries.countDocuments(filter);

        res.status(200).json({
            data: get, hasMore: skipNum + limitNum < totalDocs, totalData: totalDocs, totalYears: Object.keys(get).length, totalData: data.length, message: `The MovieSeries fetched${genre ? ` in genre '${genre}'` : ""}${industry ? ` with industry '${industry}'` : ""}${format ? ` with format '${format}'` : ""}${search ? ` matching '${search}'` : ""}, sorted by latest release date.`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    };
});

router.get("/get/details/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Movie/Series ID is required." });

        const filter = { hashedId: id };
        if (process.env.NODE_ENV === "production") filter.msGenre = { $not: { $in: [/^18\+$/i, /hard romance/i] } };

        const data = await MovieSeries.findOne(filter).select("-_id");
        if (!data) return res.status(404).json({ message: "Movie/Series not found." });

        res.status(200).json({ data, message: `Details fetched for '${data.msName}'.` });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch details", error: error.message });
    };
});

router.get("/about", (req, res) => {
    try {
        const jsonData = {
            "name": "HelloHood",
            "tagline": "Your Personal Movie & Series Tracker",
            "description": "HelloHood is a complete ecosystem of applications designed to help users track, explore, and manage their favorite movies and web series. It offers features like search, filters, watched tracking, content moderation, and an admin panel for easy management. Built with a focus on speed, privacy, and scalability.",
            "projects": {
                "Hellohood": {
                    "type": "Frontend (User)",
                    "description": "Public-facing React application for browsing and searching movies & series. Includes filters, search bar, watchlist tracking, and responsive UI components.",
                    "features": [
                        "Browse movies & series with filters like Bollywood, Hollywood, or genre",
                        "Search by movie & series title",
                        "Mark content as watched",
                        "Responsive design with Navbar & Footer",
                        "Skeleton loaders for smooth UX"
                    ],
                    "github": "https://github.com/iamvkj26/hellohood"
                },
                "Hellohood-Api": {
                    "type": "Backend (User API)",
                    "description": "Node.js + Express API for serving movies & series data to the HelloHood frontend.",
                    "features": [
                        "Content retrieval endpoints",
                        "MongoDB database integration",
                        "Utility functions for sorting & filtering",
                        "Secure server configuration"
                    ],
                    "github": "https://github.com/iamvkj26/hellohood-api"
                },
                "Hellohood-Admin": {
                    "type": "Frontend (Admin)",
                    "description": "React admin panel for content management and user role handling.",
                    "features": [
                        "Login authentication with role-based access",
                        "Add, edit, delete content",
                        "Mark content as watched/unwatched",
                        "Dashboard with quick stats",
                        "Reusable components & hooks"
                    ],
                    "github": "https://github.com/iamvkj26"
                },
                "Hellohood-Admin-Api": {
                    "type": "Backend (Admin API)",
                    "description": "Secure backend API for admin panel operations.",
                    "features": [
                        "JWT-based authentication",
                        "Role-protected routes for admins and devs",
                        "Content moderation & approval",
                        "Middleware for validation and error handling",
                        "MongoDB models for content and users"
                    ],
                    "github": "https://github.com/iamvkj26"
                }
            },
            "techStack": {
                "Frontend": ["React", "Bootstrap", "Custom Hooks", "Context API"],
                "Backend": ["Node.js", "Express.js"],
                "Database": ["MongoDB (Mongoose)"],
                "Auth": ["JWT-based authentication", "Role-based route protection"]
            },
            "roles": {
                "Guest": "Can view public content",
                "User": "Can browse movies & series",
                "Admin": "Can add, edit, delete, and mark content as watched",
                "Dev": "Same as admin, with full API and system access"
            },
            "dataHandling": {
                "Source": "Manually curated by admin team",
                "Privacy": "No personal tracking, only authentication data stored",
                "Moderation": "All changes must be approved by admins or devs"
            },
            "contact": {
                "Email": "Not Available",
                "Github": "https://github.com/iamvkj26",
                "Version": "1.0.5"
            }
        }
        res.status(200).json({ data: jsonData, message: "" });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch about us details", error: error.message });
    };
});

router.post("/contact", async (req, res) => {
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