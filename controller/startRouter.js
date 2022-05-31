const startRouter = require("express").Router()

startRouter.get("/", (request, response) => {

   if (request.isAuthenticated()) {
      response.status(200).send(request.user.name)
   } else {
      response.send(null)
   }
})

module.exports = startRouter