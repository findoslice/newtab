const express = require('express');
const cookieParser = require('cookie-parser')
const OAuth = require('oauth');
const bodyParser = require('body-parser');
const {Pool, Client} = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const config = require('./config.json');
const {sendValidatedResponse} = require('./utils.js')

const app = new express()
const pool = new Pool(config.postgres)

const unless = function(middleware) {
    return function(req, res, next) {
        if (req.path === "/register" || req.path === "/login" || req.path ===  "/bg") {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

const client = new Client(config.postgres)
client.connect()

function validateUser(req, res) {
    let code = 200;
    console.log(client.query(`SELECT * FROM users WHERE token = $1`, [req.cookies['login-token']], (error,result) => {
        //console.log(result.rows.length)
        if (result && result.rows.length > 0) {
            code = 200;
        } else {
            code = 401;
            res.status(401)
        }
        console.log(res.statusCode, code)
        return res.statusCode
    }))
}


app.use(cookieParser())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://tulip.findoslice.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cookie, Set-Cookie, credentials");
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
app.use(bodyParser.json())
// app.use(unless((req, res, next) => {
//     pool.query(`SELECT * FROM users WHERE token = $1`, [req.cookies['login-token']], (error, result) => {
//         console.log(result)
//         console.log(req.headers)
//         if (result && result.rows.length === 1) {
//             next();
//         } else {
//             return res.status(401).send();
//         }
//     })
// }))



app.get("/isloggedin", (req, res) => {
    pool.query(`SELECT name, email FROM users WHERE token = $1`, [req.cookies['login-token']], (error,result) => {
        console.log(result.rows)
        if (!error && result.rows[0]) {
            sendValidatedResponse(pool, req, res, {name: result.rows[0].name, email: result.rows[0].email})
        } else {
            sendValidatedResponse(pool, req, res, {});
        }
    })
    // console.log("loggedin", res.statusCode)
    // if (res.statusCode != 401) {
    //     res.status(200).send({})
    // } else {
    //     res.status(401).send({

    //     })
    // }
})

app.post("/register", (req, res) => {
    //console.log(req.cookies)
    pool.query(`INSERT INTO users (name, email, password_hash) 
                VALUES ($1, $2, $3)`, [req.body.name, req.body.email, bcrypt.hashSync(req.body.password, 10)], (err, result) => {
                    if (err) {
                        console.log(err)
                        return res.status(401).send()
                    } else {
                        let token = bcrypt.hashSync(config.secret + req.body.email, 1);
                        pool.query(`UPDATE users SET token = $1 WHERE email = $2`, [token, req.body.email])
                        res.cookie("login-token", token, {httpOnly: false}).json({token : token})
                    }
                })
    // let token = jwt.sign({ id: req.body.email }, config.secret, {
    //     expiresIn: 8640000000 
    // });
})

app.post("/login", (req,res) => {
    console.log(bcrypt.hashSync(req.body.password, 10))
    pool.query(`SELECT email, password_hash, token FROM users WHERE email = $1`, [req.body.email], (err, result) => {
        if (err || result.rows.length === 0) {
            console.log(err)
            res.status(400).send()
        } else {
            if (bcrypt.compareSync(req.body.password, result.rows[0].password_hash)) {
                let token = bcrypt.hashSync(config.secret + req.body.email, 1);
                pool.query(`UPDATE users SET token = $1 WHERE email = $2`, [token, req.body.email])
                res.cookie("login-token", token, {httpOnly: false}).json({token : token})
            } else {
                res.status(400).send()
            }
        }
    })
})

app.post("/logout", (req, res) => {
    res.clearCookie('login-token')
    res.send()
})

app.post("/name", (req, res) => {
    pool.query("SELECT name FROM users WHERE email = $1", [req.body.email], (err, result) => {
        if (err){
            res.status(400).send()
        } else {
            res.json({name: result.rows[0].name})
        }
    })
})

app.get("/bg", (req,res) => {
    // select a random entry
    pool.query(`SELECT background_images.*, photographers.name, photographers.url FROM background_images 
                INNER JOIN photographers ON background_images.photographer_id = photographers.id  
                ORDER BY RANDOM() LIMIT 1`, (err, result) => {
                    let entry = result.rows[0]
                    return res.json({image: entry.href, description: entry.description, photographer:{name:entry.name, url:entry.url}})
                }
            )
})


app.post("/weather", (req, res) => {
    console.log("weather", res.statusCode)
    if (res.statusCode == 401) {
        res.send()
        return
    }
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
                sendValidatedResponse(pool, req, res, JSON.parse(data))
                if (res.statusCode != 401) {
                    res.status(200).send(JSON.parse(data))
                }
            }
        }
    );
});

app.listen(7500, () => {console.log("listening on port 7500")})