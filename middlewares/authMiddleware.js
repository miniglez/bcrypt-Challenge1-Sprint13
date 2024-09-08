const jwt = require("jsonwebtoken")
const hashedSecret = require("../crypto/config.js")

function verifyToken(req, res, next){
    const token = req.session.token
    if(!token){
        return res.status(401).json({mensaje: "Token no proporcionado"})
    }
    else{
        jwt.verify(token, hashedSecret, (error, decoded) => {
            if(error){
                return res.status(401).json({mensaje: "Token invalido"})
            }
            req.user = decoded.user
            next()
        })
    }
}

module.exports = verifyToken