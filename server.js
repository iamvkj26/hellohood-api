const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT;
const mongoString = process.env.MONGO_URI;

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(mongoString, {
    maxPoolSize: 20
}).then(() =>
    console.log("Connected to MongoDB...")
).catch(err =>
    console.error("MongoDB connection error:", err)
);

app.use("/about", require("./routes/aboutRoutes"));
app.use("/movieseries", require("./routes/msRoutes"));
app.use("/query", require("./routes/queryRoutes"));

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));