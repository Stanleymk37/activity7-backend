
const pool = require("./db");

async function testDatabase() {
    try {
        const result = await pool.query("SELECT NOW() AS current_time");

        console.log("Database connected successfully!");
        console.log("Database time:", result.rows[0].current_time);
    } catch (error) {
        console.error("Database test failed:", error.message);
    } finally {
        await pool.end();
    }
}

testDatabase();
