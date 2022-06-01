const express = require('express');
const pool = require('./db.js');

const DEFAULT_NUMBER_OF_ELEMENTS = 10;
const DEFAULT_PAGE = 1;
const PORT = 3000;
const app = express();
app.use(express.json());

// ROUTES

// get all stocks
app.get("/all_stocks", async(req, res) => {
    try {
        const stocks = await pool.query('SELECT * FROM stocks');
        res.json(stocks.rows);
    } catch(error) {
        res.sendStatus(500).send(error.message);
    }
})

// get paginated stocks
app.get("/stocks", async(req, res) => {
    try {
        const page = req.query?.page || DEFAULT_PAGE;
        const size = req.query?.size || DEFAULT_NUMBER_OF_ELEMENTS;
        
        const limit = parseInt(size);
        
        // first page -> (1 - 1) * size => don't skip anything
        // second page -> (2 - 1) * size => if size is 10 skip the first 10 (elemets from page 1) and give me the next 10.
        // in mongo db it's called LIMIT
        const offset = (parseInt(page) - 1) * size; 
        const stocks = await pool.query(`SELECT * FROM stocks LIMIT ${limit} OFFSET ${offset}`);
        res.json(stocks.rows);
    } catch(error) {
        res.sendStatus(500).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
})