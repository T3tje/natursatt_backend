const foodRouter = require("express").Router()
const Food = require("../models/food")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const getTokenFrom = request => {
   const authorization = request.get("authorization")
   if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
      return authorization.substring(7)
   }
   return null
}

foodRouter.get("/", async (request, response) => {
   const result = await Food.find({})
   response.json(result)
})

foodRouter.get("/:name", async (request, response) => {
   
   let nameAndNumber = request.params.name

   const position = nameAndNumber.indexOf("~")

   const strToArray = nameAndNumber.split("")

   const nameArr = strToArray.slice(0, position)
  
   const amount = parseInt(strToArray.slice(position+1).join(""))

   const name = nameArr.join("")
  
   console.log(name)

   const result = await Food
      .find({name: { $regex: name, $options: "i" }})
      .sort({name: "asc"})
      .skip(amount)
      .limit(10)

   response.json(result)

   console.log(result)
})

foodRouter.post("/", async (request, response) => {
   const body = request.body
   const name = body.name

   const token = getTokenFrom(request)
   const decodedToken = jwt.verify(token, process.env.SECRET)
   if(!decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid"})
   }

   const user = await User.findById(decodedToken.id)

   

   const resultNumber = ((body.ew/body.kcal)*54+(body.ballast/body.kcal)*39)*10+(100/body.kcal)*16-((body.fett/body.kcal)*600)-(body.zucker/body.kcal)*160 
   var rounded = Math.round((resultNumber + Number.EPSILON) * 100) / 100
   let result = ""
   
   if (rounded >= 39) {
      result = "a"
   }

   if (rounded > 25 && rounded < 39) {
      result = "b"
   }

   if (rounded <= 25 && rounded >= 10) {
      result = "c"
   }

   if (rounded < 10) {
      result = "d"
   }
   

   const food = new Food({
      name: body.name,
      kh: body.kh,
      ew: body.ew,
      ballast: body.ballast,
      fett: body.fett,
      zucker: body.zucker,
      kcal: body.kcal,
      likes: 0,
      rate: result,
      addAmount:0,
      barcode: body.barcode,
      zusatzstoffe: body.zusatzstoffe,
      date: body.date,
      marke: body.marke,
      veggie: body.veggie,
      user: user._id
   })

   const existingFood = await Food.findOne({ name })

   if (existingFood) {
      return response.status(400).json({
         error: "Das Lebensmittel ist bereits in der Datenbank enthalten"
      })
   }
   const newFood = await food.save()
   user.foodsAdded = user.foodsAdded.concat(newFood._id)
   await user.save()
   response.status(201)
   response.json(newFood)
   
})

module.exports = foodRouter