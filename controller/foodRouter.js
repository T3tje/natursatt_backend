const foodRouter = require("express").Router()
const Food = require("../models/food")
const User = require("../models/user")
const middleware = require("../utils/middleware")
const helper = require("../utils/for_testing")
const sendInBlue = require("../utils/sendinblue")



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
     
      const oldFood = await Food.findById(request.body._id)
      
      console.log(oldFood)

      const newFood = await Food.updateOne({_id:request.body._id},request.body)

      const user = await User.findById(oldFood.user[0])
      const userName = user.name

      if (oldFood.ballast === null) {
         const subject = "Lebensmittel ist nun verfügbar"
         const text = `Liebe(r) ${userName}, \n
         Vielen Dank für das Hinzufügen des Lebensmittels ${oldFood.name}\n
         Es ist nun vollständig in unserer Datenbank und kann verwendet werden.`
         
         sendInBlue.sendEmail(user.email, subject, text)
      }
 
      response.status(201).send(newFood) 
 
   } else {
      response.status(401).send()
   }

})

foodRouter.get("/checkList", middleware.isAuth, async(request, response) => {
   if (request.user.isAdmin) {
      let checkerList = await Food.find({new:true}).sort({ballast: "asc"})
      console.log(checkerList)
      response.status(200).send(checkerList)
   }
   else { 
      response.status(401).send()
   }
})


foodRouter.post("/getfood", async (request, response) => {
   
   const amount = request.body.amount
   const name = request.body.name

   const result = await Food
      .find({name: { $regex: name, $options: "i" }})
      .where("ballast").ne(null)
      .sort({name: "asc"})
      .skip(amount)
      .limit(10)

   response.json(result)
   
})

foodRouter.post("/", middleware.isAuth, async (request, response) => {
   
   const body = request.body
   const userId = request.user.id
   const user_Id = request.user._id
   const userName = request.user.name
   const userEmail = request.user.email

   if (body.ballast === null) {
      const subject = "Food ohne Ballaststoffe geadded"
      const text = `${userName} mit der Email: ${userEmail} hat das Lebensmittel: ${body.name} hinzugefügt ohne Ballaststoffangabe`
      const email = "tilman2013@gmail.com"
      
      sendInBlue.sendEmail(email, subject, text)
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
   user.foodsAdded = user.foodsAdded.concat(newFood._id)
   await user.save()

   // RESPONSE
   response.status(201)
   response.json(newFood)
   
})

module.exports = foodRouter