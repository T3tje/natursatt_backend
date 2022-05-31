const loginRouter = require("express").Router()
const passport = require("passport")


loginRouter.post("/", passport.authenticate("local"), async (request, response) => {
   
   response.status(200).send(request.user.name)
})

module.exports = loginRouter