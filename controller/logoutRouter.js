const logoutRouter = require("express").Router()

logoutRouter.post("/", (request, response) => {
   request.logout()
   response.status(200).send()
})

module.exports = logoutRouter