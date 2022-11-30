const startRouter = require("express").Router()

startRouter.get("/", (request, response) => {

   console.log("ip-adresse vom user", request)
   if (request.isAuthenticated()) {
      
      const userObject = {
         name:request.user.name,
         id: request.user.id,
         isAdmin: request.user.isAdmin
      }
      
      response.status(200).send(userObject)
   } else {
      response.send(null)
   }
})

module.exports = startRouter