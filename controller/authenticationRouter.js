const authenticationRouter = require("express").Router()

authenticationRouter.get("/passwordrecover", (request, response) => {
   response.redirect("/authentication/passwordrecover")
  
})

module.exports = authenticationRouter