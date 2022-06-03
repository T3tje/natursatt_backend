const config = require ("./utils/config.js")
const express = require("express")
const middleware = require("./utils/middleware")
require("express-async-errors")
const app = express()
const foodRouter = require("./controller/foodRouter")
const userRouter = require("./controller/userRouter")
const loginRouter = require("./controller/loginRouter")
const logoutRouter = require("./controller/logoutRouter")
const startRouter = require("./controller/startRouter")
const passwordRouter = require("./controller/passwordRouter.js")
const resetRouter = require("./controller/resetRouter.js")
const mongoose = require("mongoose")
const cors = require("cors")
const logger = require("./utils/logger")
const sendInBlue = require("./utils/sendinblue")
const session = require("express-session")
const passport = require("passport")
require("./utils/passport")

logger.info("connecting to MongoDB")
mongoose.connect(config.MONGODB_URI)
   .then(() => {
      logger.info("connected to MongoDB")
   })
   .catch((error) => {
      logger.error("error connecting to MongoDB", error.message)
   })


app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(middleware.requestLogger)

app.use(session(config.SESSION_OBJ))
app.use(passport.initialize())
app.use(passport.session())

/* app.use((request, response, next) => {
   console.log("request.session", request.session)
   console.log("request.user", request.user)
   next()
}) */


app.use("/api/checkauth", startRouter)
app.use("/api/food", foodRouter)
app.use("/api/users", userRouter)
app.use("/api/login", loginRouter)
app.use("/api/logout", logoutRouter)
app.use("/api/password", passwordRouter)
app.use("/api/resetpassword", resetRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

