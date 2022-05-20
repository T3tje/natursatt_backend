const logoutRouter = require("express").Router()
// const User = require("../models/user")


logoutRouter.post("/", (request, response) => {
   request.logout()
   response.status(200).send()
})

module.exports = logoutRouter