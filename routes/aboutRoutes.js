const express = require("express");
const router = express.Router();

router.get("/get", (req, res) => {
    try {
        const jsonData = {
            "name": "HelloHood",
            "tagline": "Your Personal Movie & Series Tracker",
            "description": "HelloHood is a complete ecosystem of applications designed to help users track, explore, and manage their favorite movies and web series. It offers features like search, filters, watched tracking, seasons management, OTT platform tracking, collections, and an admin panel for easy content management. Built with a focus on speed, privacy, and scalability.",
            "projects": {
                "Hellohood": {
                    "type": "Frontend (User)",
                    "description": "Public-facing React application for browsing and searching movies & series.",
                    "features": [
                        "Browse movies & series with filters like Bollywood, Hollywood, or genre",
                        "Search by movie, series title or cast name",
                        "Filter by OTT platform (Netflix, Prime, Hotstar, etc.)",
                        "Browse by collections and genres",
                        "View season-wise details for series",
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
                        "Content retrieval with advanced filters",
                        "Full-text search on title and cast",
                        "OTT platform filtering",
                        "Collections endpoint",
                        "Season-wise data for series",
                        "MongoDB database integration",
                        "Secure server configuration"
                    ],
                    "github": "https://github.com/iamvkj26/hellohood-api"
                },
                "Hellohood-Admin": {
                    "type": "Frontend (Admin)",
                    "description": "React admin panel for content management and role-based access control.",
                    "features": [
                        "Login authentication with role-based access",
                        "Add, edit, delete movies & series",
                        "Auto-fetch cast and seasons from TMDB",
                        "Mark content as watched/unwatched",
                        "Season-wise watched tracking",
                        "Dashboard with stats, charts and activity feed",
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
                        "TMDB API integration for cast and season sync",
                        "Cloudinary integration for poster management",
                        "Auto OTT detection from streaming links",
                        "Dashboard aggregations and analytics",
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
                "Auth": ["JWT-based authentication", "Role-based route protection"],
                "Media": ["Cloudinary (poster storage)"],
                "External": ["TMDB API (cast & seasons sync)"]
            },
            "roles": {
                "Guest": "Can view public content",
                "User": "Can browse movies & series",
                "Admin": "Can add, edit, delete, and mark content as watched",
                "Dev": "Same as admin, with full API and system access"
            },
            "dataHandling": {
                "Source": "Manually curated by admin team via TMDB integration",
                "Privacy": "No personal tracking, only authentication data stored",
                "Moderation": "All changes must be approved by admins or devs",
                "Media": "Posters stored securely on Cloudinary"
            },
            "contact": {
                "Email": "Not Available",
                "Github": "https://github.com/iamvkj26",
                "Version": "1.1.0"
            }
        };
        res.status(200).json({ data: jsonData });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch about us details", error: error.message });
    };
});

module.exports = router;