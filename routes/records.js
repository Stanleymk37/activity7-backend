
const express = require("express");
const router = express.Router();
const pool = require("./db");

// GET all records
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM records ORDER BY id ASC"
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Failed to retrieve records." });
    }
});

// GET one record
router.get("/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM records WHERE id = $1",
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Record not found." });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Failed to retrieve record." });
    }
});

// POST create a record
router.post("/", async (req, res) => {
    const { title, category, description, status } = req.body;

    if (!title || !category || !description || !status) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO records (title, category, description, status)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [title, category, description, status]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: "Failed to create record." });
    }
});

// PUT update a record
router.put("/:id", async (req, res) => {
    const { title, category, description, status } = req.body;

    if (!title || !category || !description || !status) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const result = await pool.query(
            `UPDATE records
             SET title = $1, category = $2, description = $3, status = $4
             WHERE id = $5
             RETURNING *`,
            [title, category, description, status, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Record not found." });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: "Failed to update record." });
    }
});

// DELETE a record
router.delete("/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM records WHERE id = $1 RETURNING id",
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Record not found." });
        }

        res.status(200).json({ message: "Record deleted." });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Failed to delete record." });
    }
});

module.exports = router;
