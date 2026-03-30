const express = require("express");
const router = express.Router();
const MovieSeries = require("../models/msModel.js");

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

router.get("/get", async (req, res) => {
    try {
        const { search, format, industry, genre, collection, watched, ott, skip = 0, limit = 20 } = req.query;
        const filter = {};

        if (search) filter.msName = { $regex: new RegExp(escapeRegex(search), "i") };
        if (format) filter.msFormat = { $regex: new RegExp(`^${escapeRegex(format)}$`, "i") };
        if (industry) filter.msIndustry = { $regex: new RegExp(`^${escapeRegex(industry)}$`, "i") };
        if (genre) filter.msGenre = { $in: [new RegExp(`^${escapeRegex(genre)}$`, "i")] };
        if (collection) filter["msCollection.name"] = { $regex: new RegExp(`^${escapeRegex(collection)}$`, "i") };
        if (watched === "true") filter.msWatched = true;
        else if (watched === "false") filter.msWatched = false;
        if (ott) filter.ott = ott;

        const skipNum = parseInt(skip);
        const limitNum = parseInt(limit);

        const data = await MovieSeries.find(filter).sort({ msReleaseDate: -1 }).skip(skipNum).limit(limitNum).select("-_id -msFormat -msIndustry -__v").lean();

        const now = new Date();
        const upcoming = [];
        const groupedByYear = {};

        data.forEach(item => {
            const releaseDate = new Date(item.msReleaseDate);
            if (releaseDate > now) upcoming.push(item);
            else {
                const year = releaseDate.getFullYear();
                if (!groupedByYear[year]) groupedByYear[year] = [];
                groupedByYear[year].push(item);
            };
        });

        const sections = [];
        if (upcoming.length > 0) sections.push({ label: "upcoming", movies: upcoming });

        Object.keys(groupedByYear).sort((a, b) => b - a).forEach(year => {
            sections.push({ label: year, movies: groupedByYear[year] });
        });

        const totalDocs = await MovieSeries.countDocuments(filter);

        const countsAgg = await MovieSeries.aggregate([{ $match: filter }, {
            $facet: {
                industry: [{
                    $group: {
                        _id: { $cond: [{ $in: ["$msIndustry", ["Hollywood", "Bollywood"]] }, "$msIndustry", "Others"] },
                        count: { $sum: 1 }
                    }
                }],
                format: [{ $group: { _id: "$msFormat", count: { $sum: 1 } } }],
                watched: [{ $group: { _id: "$msWatched", count: { $sum: 1 } } }]
            }
        }]);

        const industryCounts = countsAgg[0].industry.reduce((acc, cur) => {
            acc[cur._id.toLowerCase()] = cur.count;
            return acc;
        }, {});

        const formatCounts = countsAgg[0].format.reduce((acc, cur) => {
            acc[cur._id.toLowerCase()] = cur.count;
            return acc;
        }, {});

        const watchedCounts = countsAgg[0].watched.reduce((acc, cur) => {
            acc[cur._id ? "watched" : "unwatched"] = cur.count;
            return acc;
        }, {});

        res.status(200).json({ data: sections, hasMore: skipNum + limitNum < totalDocs, counts: { total: totalDocs, industry: { hollywood: industryCounts.hollywood || 0, bollywood: industryCounts.bollywood || 0, others: industryCounts.others || 0 }, format: { movie: formatCounts.movie || 0, series: formatCounts.series || 0 }, watched: { watched: watchedCounts.watched || 0, unwatched: watchedCounts.unwatched || 0 } }, message: `The MovieSeries fetched${genre ? ` in genre '${genre}'` : ""}${industry ? ` with industry '${industry}'` : ""}${format ? ` with format '${format}'` : ""}${search ? ` matching '${search}'` : ""}, sorted by latest release date.` });
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

        const data = await MovieSeries.findOne(filter).select("-_id -__v -hashedId -msCollection");
        if (!data) return res.status(404).json({ message: "Movie/Series not found." });

        res.status(200).json({ data, message: `Details fetched for '${data.msName}'.` });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch details", error: error.message });
    };
});

router.get("/collections", async (req, res) => {
    try {
        const collections = await MovieSeries.aggregate([
            { $match: { msCollection: { $ne: null } } },
            { $group: { _id: "$msCollection.name", icon: { $first: "$msCollection.icon" } } },
            { $project: { name: "$_id", icon: 1, _id: 0 } }
        ]);
        res.status(200).json({ data: collections });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch collections", error: error.message });
    };
});

module.exports = router;