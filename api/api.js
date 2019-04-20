const express = require('express');
const OAuth = require('oauth');
const bodyParser = require('body-parser');
const {Pool, Client} = require('pg');

const config = require('./config.json');

const app = new express()
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyParser.json())

const pool = new Pool(config.postgres)

app.get("/bg", (req,res) => {
    // select a random entry
    pool.query("SELECT * FROM background_images ORDER BY RANDOM() LIMIT 1", (err, result) => {
        let entry = result.rows[0]
        return res.json({image: entry.url, description: entry.description, photographer:{name:entry.photographer, url:entry.photographer_url}})
    })
})

app.post("/weather", (req,res) => {
    let header = {
        "X-Yahoo-App-Id": config.yahoo.appID
    };
    let request = new OAuth.OAuth(
        null,
        null,
        config.yahoo.consumerPublic,
        config.yahoo.consumerSecret,
        '1.0',
        null,
        'HMAC-SHA1',
        null,
        header
    );
    request.get(
        `https://weather-ydn-yql.media.yahoo.com/forecastrss?lat=${req.body.lat}&lon=${req.body.lon}&format=json&u=c`,
        null,
        null,
        function (err, data, result) {
            if (err) {
                console.log(err);
            } else {
                //console.log(JSO(data))
                return res.json(JSON.parse(data))
            }
        }
    );
});

app.listen(7500, () => {console.log("listening on port 7500")})