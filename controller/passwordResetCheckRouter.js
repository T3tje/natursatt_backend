const passwordResetCheckRouter = require("express").Router()
const User = require("../models/user")
const jwt = require("jsonwebtoken")

passwordResetCheckRouter.post("/", async (request, response) => {
   const {userId, token} = request.body

   if (!token || !userId) {
      response.status(400).send()
      return
   }

   const user = await User.findById( userId )

   const secret = process.env.SECRET + user.passwordHash

   const decodedToken = await jwt.verify(token, secret)

   console.log("decodedToken", decodedToken)
   
   response.status(200).send()

})

module.exports = passwordResetCheckRouter

