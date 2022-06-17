const foodRouter = require("express").Router()
const Food = require("../models/food")
const User = require("../models/user")
const middleware = require("../utils/middleware")
const helper = require("../utils/for_testing")
const food = require("../models/food")


foodRouter.get("/favorites", middleware.isAuth, async (request, response) => {
 
   console.log("request.user", request.user)
   const user = await User.find({ email: request.user.email}).populate("foodsSaved")
   response.status(200).json(user)
})


foodRouter.post("/favorites", middleware.isAuth, async (request, response) => {
   const food_Id = request.body._id
   const userId = request.user.id
   const foodToUpdate = await Food.findById(food_Id)
   const userToUpdate = await User.findById(userId)

   if (foodToUpdate.addedBy.indexOf(userToUpdate._id) === -1) {

      foodToUpdate.addedBy = foodToUpdate.addedBy.concat(userToUpdate._id)
      userToUpdate.foodsSaved = userToUpdate.foodsSaved.concat(foodToUpdate._id)

      await foodToUpdate.save()
      await userToUpdate.save()

      response.status(200).json(foodToUpdate)
   } 
   
   else {  
      
      const successFood = await Food.findOneAndUpdate({_id: food_Id}, {
         $pullAll: { addedBy: [userId] }
      },
      { new: true }
      )  
      
      await User.findOneAndUpdate({_id: userId}, {
         $pullAll: { foodsSaved: [food_Id] }
      },
      { new: true }
      
      )
      response.status(200).send(successFood)
   } 
})

foodRouter.post("/update", middleware.isAuth, async (request, response) => {
   if (request.user.isAdmin) {
     
      const newFood = await Food.updateOne({name:request.body.name},request.body)
     
      response.status(201).send(newFood)
  
   } else {
      response.status(401).send()
   }

})

foodRouter.get("/checkList", middleware.isAuth, async(request, response) => {
   if (request.user.isAdmin) {
      let checkerList = await Food.find({new:true})
      console.log(checkerList)
      response.status(200).send(checkerList)
   }
   else { 
      response.status(401).send()
   }
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
      barcode: body.barcode,
      zusatzstoffe: body.zusatzstoffe,
      date: body.date,
      marke: body.marke,
      veggie: body.veggie,
      user: user_Id,
      new: true
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
   console.log(user.foodsAdded)
   user.foodsAdded = user.foodsAdded.concat(newFood._id)
   await user.save()

   // RESPONSE
   response.status(201)
   response.json(newFood)
   
})

module.exports = foodRouter