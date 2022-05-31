const express = require('express');
const pool = require('./db.js');

const PORT = 3000;
const app = express();
app.use(express.json());

// ROUTES

// get all products
app.get("/stocks", async(req, res) => {
    const stocks = await pool.query('SELECT * FROM stocks');
    res.json(stocks.rows);
})

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
})