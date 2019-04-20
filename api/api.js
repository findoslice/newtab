const express = require('express');
const OAuth = require('oauth');
const bodyParser = require('body-parser');

const config = require('./config.json');

const app = new express()
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyParser.json())

app.get("/bg", (req,res) => {
    return res.json({image: "https://cdn.newtab.findoslice.com/mostar-background.jpg", description: "Mostar is the largest city in Hercegovina in Bosnia, it is famous for its old bride.", photographer:{name:"Findlay Smith", url:"https://findoslice.com"}})
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
    console.log(req.body)
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