const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const cheerios = require('cheerio');
const axios = require('axios');

app.get('/', (req, res) => {
    res.json("hello");
})

app.get('/api/data/:id', async(req, res) => {
    const { id } = req.params;
                 
    try {
        const url = `https://atcoder.jp/users/${id}`;
            
        const { data } = await axios.get(url);

        const $ = cheerios.load(data);

        const scrapedData = {};


        scrapedData["Global Rank"] = $('div.row > div.col-md-9.col-sm-12 > table > tbody > tr:nth-child(1) > td').text();
        scrapedData["Rated Matches"] = $('div.row > div.col-md-9.col-sm-12 > table > tbody > tr:nth-child(4) > td').text()
        scrapedData["Current Rating"] = $('div.row > div.col-md-9.col-sm-12 > table > tbody > tr:nth-child(2) > td > span').text();
        scrapedData["Highest Rating"] = $('div.row > div.col-md-9.col-sm-12 > table > tbody > tr:nth-child(3) > td > span.user-red').text();

        res.json(scrapedData);
    } catch (error) {
        console.error("Error fetching or scraping:", error.message);
        res.status(500).json({ error: "Failed to fetch or parse user profile." });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`server running at ${port}`);
})

module.exports = app;