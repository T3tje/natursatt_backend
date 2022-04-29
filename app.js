const config = require ("./utils/config.js")
const express = require("express")
const middleware = require("./utils/middleware")
require("express-async-errors")
const app = express()
const foodRouter = require("./controller/foodRouter")
const mongoose = require("mongoose")
const cors = require("cors")

console.log("connecting to MongoDB")
mongoose.connect(config.MONGODB_URI)
   .then(() => {
      console.log("connected to MongoDB")
   })
   .catch((error) => {
      console.log("error connecting to MongoDB", error.message)
   })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use("/api/food", foodRouter)

module.exports = app

