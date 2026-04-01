const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const port = process.env.PORT || 3000;

if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");
const mongoString = process.env.MONGO_URI;

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

mongoose.connect(mongoString, {
    maxPoolSize: 20
}).then(() =>
    console.log("Connected to MongoDB...")
).catch(err =>
    console.error("MongoDB connection error:", err)
);

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/about", require("./routes/aboutRoutes"));
app.use("/movieseries", require("./routes/msRoutes"));
app.use("/query", require("./routes/queryRoutes"));

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({ message: "Something went wrong", error: error.message });
});

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));