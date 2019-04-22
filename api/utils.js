const sendValidatedResponse = (pool, req, res, body) => {
    let code = 200;
    console.log(req.cookies)
    pool.query(`SELECT * FROM users WHERE token = $1`, [req.cookies['login-token']], (error,result) => {
        //console.log(result.rows.length)
        if (result.rows.length > 0) {
            console.log("beep")
            return res.status(200).send(body)
        } else {
            code = 401;
            return res.status(401).send()
        }
    })
}

module.exports = { sendValidatedResponse };