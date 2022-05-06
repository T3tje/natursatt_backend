const config = require ("./utils/config.js")
const express = require("express")
const middleware = require("./utils/middleware")
require("express-async-errors")
const app = express()
const foodRouter = require("./controller/foodRouter")
const mongoose = require("mongoose")
const cors = require("cors")
const logger = require("./utils/logger")
const userRouter = require("./controller/userRouter.js")

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
app.use(middleware.requestLogger)
app.use("/api/food", foodRouter)
app.use("/api/users", userRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

