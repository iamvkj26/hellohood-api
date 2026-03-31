const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    hashedId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    msName: {
        type: String,
        required: true,
        trim: true,
        index: true
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
    msGenre: {
        type: [String],
        required: true,
        index: true
    },
    msFormat: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    msIndustry: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    msSeason: {
        type: String,
        required: true
    },
    msReleaseDate: {
        type: String,
        required: true,
        index: true
    },
    msRating: {
        type: Number,
        required: true
    },
    msWatched: {
        type: Boolean,
        default: false,
        index: true
    },
    msCollection: {
        type: {
            name: {
                type: String,
                required: true
            },
            icon: {
                type: String,
                required: true
            },
        },
        trim: true,
        index: true,
        default: null
    },
    ott: {
        type: String,
        enum: ["netflix", "prime", "hotstar", "zee5", "sonyliv", "lionsgateplay", "other", "none"],
        index: true,
        default: "none"
    }
});

movieSchema.index({ msName: 1, msReleaseDate: -1 }, { unique: true });

module.exports = mongoose.model("MovieSeries", movieSchema);