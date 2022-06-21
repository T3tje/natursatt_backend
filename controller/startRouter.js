const startRouter = require("express").Router()

startRouter.get("/", (request, response) => {

   if (request.isAuthenticated()) {
      
      const userObject = {
         name:request.user.name,
         id: request.user.id,
         isAdmin: request.user.isAdmin
      }

      console.log(request.user.id)
      response.status(200).send(userObject)
   } else {
      response.send(null)
   }
})

module.exports = startRouter