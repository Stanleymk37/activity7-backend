
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const pool = require("./db");
const recordsRouter = require("./records");

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send(`
        <h1>Student Timetable & Goals API</h1>
        <p>Welcome to the Student Timetable & Goals backend API.</p>
        <p><a href="/health">Health Check</a></p>
        <p><a href="/api/records">View All Records</a></p>
    `);
});

// Health check
app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.status(200).json({
            message: "Server and database are running."
        });
    } catch (error) {
        console.error(error.message);
        res.status(503).json({
            message: "Database connection failed."
        });
    }
});

// Records API
app.use("/api/records", recordsRouter);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found." });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
