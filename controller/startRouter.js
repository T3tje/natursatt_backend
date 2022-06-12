const startRouter = require("express").Router()

startRouter.get("/", (request, response) => {

   if (request.isAuthenticated()) {
      
      console.log(request.user.id)
      const userObject = {
         name:request.user.name,
         id: request.user.id
      }
      response.status(200).send(userObject)
   } else {
      response.send(null)
   }
})

module.exports = startRouter