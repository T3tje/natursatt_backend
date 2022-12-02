const startRouter = require("express").Router()
const TrackedEvent = require("../models/trackedevents")

startRouter.get("/", async (request, response) => {
  
   const event = TrackedEvent({
      art: "start",
      date: Date(),
   })
  
   await event.save()
  
   console.log("Neuer Seitenbesucher")

   if (request.isAuthenticated()) {
      const userObject = {
         name: request.user.name,
         id: request.user.id,
         isAdmin: request.user.isAdmin,
      }

      response.status(200).send(userObject)
   } else {
      response.send(null)
   }
})

module.exports = startRouter
