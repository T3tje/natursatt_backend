const foodRouter = require("express").Router()
const Food = require("../models/food")
const User = require("../models/user")
const middleware = require("../utils/middleware")
const helper = require("../utils/for_testing")

foodRouter.get("/favorites", middleware.isAuth, async (request, response) => {
 
   console.log("request.user", request.user)
   const user = await User.find({ email: request.user.email}).populate("foodsAdded")
   response.status(200).json(user)
   
   
})


foodRouter.get("/:name", async (request, response) => {
   
   let nameAndNumber = request.params.name

   const position = nameAndNumber.indexOf("~")

   const strToArray = nameAndNumber.split("")

   const nameArr = strToArray.slice(0, position)
  
   const amount = parseInt(strToArray.slice(position+1).join(""))

   const name = nameArr.join("")

   const result = await Food
      .find({name: { $regex: name, $options: "i" }})
      .sort({name: "asc"})
      .skip(amount)
      .limit(10)

   response.json(result)
   
})

foodRouter.post("/", middleware.isAuth, async (request, response) => {
   
   const body = request.body
   const userId = request.user.id
   const user_Id = request.user._id

 

   const food = new Food({
      name: body.name,
      kh: body.kh,
      ew: body.ew,
      ballast: body.ballast,
      fett: body.fett,
      zucker: body.zucker,
      kcal: body.kcal,
      likes: 0,
      rate: helper.getRate(body),
      addAmount:0,
      barcode: body.barcode,
      zusatzstoffe: body.zusatzstoffe,
      date: body.date,
      marke: body.marke,
      veggie: body.veggie,
      user: user_Id
   })

   const name = body.name
   const existingFood = await Food.findOne({ name })

   if (existingFood) {
      return response.status(400).json({
         error: "Lebensmittel bereits vorhanden"
      })
   }

   const newFood = await food.save()

   // USER UPDATE
   const user = await User.findById( userId )
   user.foodsAdded = user.foodsAdded.concat(newFood._id)
   await user.save()

   // RESPONSE
   response.status(201)
   response.json(newFood)
   
})

module.exports = foodRouter