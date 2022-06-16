const loginRouter = require("express").Router()
const passport = require("passport")


loginRouter.post("/", passport.authenticate("local"), async (request, response) => { 
      
   const userObject = {
      name:request.user.name,
      id: request.user.id,
      isAdmin: request.user.isAdmin
   }
   response.status(200).send(userObject)
})

module.exports = loginRouter