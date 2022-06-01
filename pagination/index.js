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
app.get("/stocks-with-offset", async(req, res) => {
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

app.get("/stocks-cursor-based", async(req, res) => {
    try {
        let previousCursor = req.query?.prev || null;
        let nextCursor = req.query?.next || null;
        const size = req.query?.size || DEFAULT_NUMBER_OF_ELEMENTS;
        const limit = parseInt(size);
        let query = '';

        if(!previousCursor && !nextCursor) {
            query = `SELECT * FROM STOCKS LIMIT ${limit}`;
        }

        if(nextCursor !== null) {
            query = `SELECT * FROM STOCKS WHERE id > ${nextCursor} LIMIT ${limit}`;
        }

        if(previousCursor !== null) {
            query = `SELECT * FROM STOCKS WHERE id < ${nextCursor} LIMIT ${limit}`;
        }
        
        const data = (await pool.query(query)).rows;
        previousCursor = data[0].id;
        nextCursor = data[data.length - 1].id;
        const stocks = {data: data, previousCursor: previousCursor, nextCursor: nextCursor};
        res.json(stocks);
    } catch(error) {
        res.sendStatus(500).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
})