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
    console.log(req.get("origin"))
    res.header("Access-Control-Allow-Origin", req.get("origin"));
    res.header("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT, OPTIONS, HEAD")
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
    pool.query(`SELECT name, preferred_name, email FROM users WHERE token = $1`, [req.cookies['login-token']], (error,result) => {
        console.log(result.rows)
        if (!error && result.rows[0]) {
            sendValidatedResponse(pool, req, res, {name: result.rows[0].name, preferred_name: result.rows[0].preferred_name, email: result.rows[0].email})
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
    pool.query(`INSERT INTO users (name, preferred_name, email, password_hash) 
                VALUES ($1, $2, $3, $4)`, [req.body.name, req.body.name.split(" ")[0], req.body.email, bcrypt.hashSync(req.body.password, 10)], (err, result) => {
                    if (err) {
                        console.log(err)
                        return res.status(401).send()
                    } else {
                        let token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                        pool.query(`UPDATE users SET token = $1 WHERE email = $2`, [token, req.body.email])
                        res.cookie("login-token", token, {httpOnly: false, expires: new Date(Date.now() + (1000*3600*24*365*100))}).json({token : token})
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
                pool.query("SELECT token FROM users WHERE email = $1", [req.body.email], (err, result) => {
                    res.cookie("login-token", result.rows[0].token, {httpOnly: false, expires: new Date(Date.now() + (1000*3600*24*365*100))}).json({token : result.rows[0].token})
                })
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

app.get("/name", (req, res) => {
    console.log(req.cookies)
    pool.query("SELECT name, preferred_name FROM users WHERE token = $1", [req.cookies['login-token']], (err, result) => {
        if (err){
            res.status(400).send()
        } else {
            res.json({name: result.rows[0].name, preferred_name: result.rows[0].preferred_name})
        }
    })
})

app.post("/updatename", (req, res) => {
    pool.query("UPDATE users SET preferred_name = $1 WHERE token = $2", [req.body.preferred_name, req.cookies["login-token"]], (err, result) => {
        if (err) {
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
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

app.get("/todos/all", (req, res) => {
    pool.query("SELECT todos.* FROM todos LEFT JOIN users ON todos.user_id = users.id WHERE users.token = $1;", [req.cookies['login-token']], (err, result) => {
        if (!err && result.rows.length > 0) {
            response = {unclassified: result.rows}
            res.json(response)
        } else if (result.rows.length === 0) {
            res.send(204)
        } else {
            res.send(400)
        }
    })
})

app.post("/todos/update", (req,res) => {
    pool.query(`UPDATE todos
                SET content = $1
                FROM users
                WHERE todos.id = $2 AND todos.user_id = users.id AND users.token = $3`, [req.body.content, req.body.id, req.cookies['login-token']], (err, result) => {
        if (err) {
            console.log(err.stack)
            res.send(400)
        } else {
            res.send(200)
        }
    })
})

app.post("/todos/new", (req, res) => {
    console.log(req.body)
    pool.query(`INSERT INTO todos (content, list_heading, sublist, user_id) SELECT $1,$2,$3, id FROM users WHERE token = $4 RETURNING todos.*;`, [req.body.content, req.body.list_heading, req.body.sublist, req.cookies['login-token']], (err, result) => {
        if (err) {
            console.log(err.stack)
            res.sendStatus(400)
        } else {
            console.log(result)
            res.json(result.rows[0])
        }
    })
})

app.post("/todos/complete", (req, res) => {
    pool.query("UPDATE todos SET completed = $1 WHERE id = $2 AND user_id IN (SELECT id FROM users WHERE token = $2);", [req.body.status, req.body.id, req.cookies['login-token']], (err, result) => {
        if (err) {
            console.log(err.stack)
            res.sendStatus(400)
        } else {
            res.sendStatus(200)
        }
    })
})

app.delete("/todos/delete", (req,res) => {
    pool.query(`DELETE FROM todos WHERE id = $1 AND user_id IN (SELECT id FROM users WHERE token = $2);`, [req.body.id, req.cookies['login-token']], (err, result) => {
        if (err) {
            console.log(err.stack)
            res.sendStatus(400)
        } else {
            res.sendStatus(200)
        }
    })
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

app.get("/lifetracker", (req, res) => {
    pool.query("SELECT * FROM lifetracker;", (err, result) => {
        if (err) {
            console.log(err.stack)
            res.sendStatus(500)
        } else {
            res.json(result.rows)
        }
    })
})

app.listen(7500, () => {console.log("listening on port 7500")})