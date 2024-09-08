const express = require("express")
const jwt = require("jsonwebtoken")
const router = express.Router()
const hashedSecret = require("../crypto/config.js")
const users = require("../data/users.js")
const verifyToken = require("../middlewares/authMiddleware.js")

router.get("/", (req, res) => {
    const template = 
    `
        <form action="/login" method="post">
            <label for="username">Usuario:</label>
            <input type="text" id="username" name="username" required><br>
            <label for="password">Contraseña</label>
            <input type="password" id="password" name="password" required><br>
            <button type="submit">Log in</button>
        </form>
        <a href="/dashboard">Dashboard</a>
    `
    res.send(template)
})

router.post("/login", (req, res) => {
    const {username, password} = req.body
    const user = users.find(user => user.username === username && user.password === password)
    
    if(!user){
        res.status(401).json({error: "Credenciales incorrectas"})
    }
    else{
        const token = generateToken(user)
        req.session.token = token
        res.redirect("/dashboard")
    }
})

router.get("/dashboard", verifyToken, (req, res) => {
    const userID = req.user
    const user = users.find(user => user.id === userID)

    if(user){
        const template = 
        `
            <h1>Bienvenido ${user.name}</h1>
            <p>ID: ${user.id}</p>
            <p>Username: ${user.username}</p>
            <p>Password: ${user.password}</p>
            <form action="/logout" method="post">
                <button type="submit">Log Out</button>
            </form>
            <a href="/">HOME</a>
        `
        res.send(template)
    }
})

router.post("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/")
})

function generateToken (user) {
    return jwt.sign({user: user.id}, hashedSecret, {expiresIn: "1h"})
}

module.exports = router