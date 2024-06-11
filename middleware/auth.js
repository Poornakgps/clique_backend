const db = require("../models")
const jwt = require('jsonwebtoken')

const Users = db.User

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")

        // console.log(req)
        console.log("HEADER: ", req.header("Authorization"))

        if(!token) return res.status(400).json({msg: "Invalid Authentication1."})

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if(!decoded) return res.status(400).json({msg: "Invalid Authentication2."})

        // console.log(decoded.id,' munda')

        const user = await Users.findOne({where : { id: decoded.id}})
        
        req.user = user
        // console.log(user)
        // console.log(decoded.id,' munda')
        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}


module.exports = auth