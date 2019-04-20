const express = require('express');
const OAuth = require('oauth');
const bodyParser = require('body-parser');

const app = new express()
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyParser.json())

app.post("/weather", (req,res) => {
    let header = {
        "X-Yahoo-App-Id": "cbUnH26e"
    };
    let request = new OAuth.OAuth(
        null,
        null,
        'dj0yJmk9ZHlvUGhxS09PS2dXJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWM2',
        '586d706ebc009e4645c41c2f24f7155be996be79',
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