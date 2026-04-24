const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    hashedId: {
        type: String,
        unique: true
    },
    msName: {
        type: String,
        required: true,
        trim: true
    },
    msAbout: {
        type: String,
        required: true,
        trim: true
    },
    msPoster: {
        type: String,
        required: true,
        trim: true
    },
    msLink: {
        type: String,
        required: true,
        trim: true
    },
    msFormat: {
        type: String,
        required: true,
        trim: true
    },
    msIndustry: {
        type: String,
        required: true,
        trim: true
    },
    msCast: {
        type: [String],
        required: true,
        default: []
    },
    msGenre: {
        type: [String],
        required: true
    },
    msSeason: {
        type: String,
        required: true
    },
    msRating: {
        type: Number,
        required: true
    },
    msReleaseDate: {
        type: String,
        required: true
    },
    msAddedAt: {
        type: Date,
        default: Date.now,
        validate: {
            validator: (value) => value >= MIN_ADDED_DATE && value <= new Date(), message: "Movie/Series Added Date cannot be before 28 June 2025."
        }
    },
    msWatched: {
        type: Boolean,
        default: false
    },
    msWatchedAt: {
        type: Date,
        default: null
    },
    msCollection: {
        type: {
            name: { type: String, required: true },
            icon: { type: String, required: true },
        },
        trim: true,
        default: null
    },
    ott: {
        type: String,
        enum: ["netflix", "prime", "hotstar", "zee5", "sonyliv", "lionsgateplay", "other", "none"],
        default: "none"
    }
});

movieSchema.index({ msName: 1, msReleaseDate: 1 }, { unique: true });

[{ msReleaseDate: -1 }, { msReleaseDate: 1 }, { msName: 1 }, { msCast: 1 }, { msFormat: 1, msIndustry: 1 }, { msGenre: 1 }, { "msCollection.name": 1 }, { msWatched: 1 }, { ott: 1 }].forEach(index => movieSchema.index(index));

module.exports = mongoose.model("MovieSeries", movieSchema);