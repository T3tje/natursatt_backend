const foodRouter = require("express").Router()
const Food = require("../models/food")

foodRouter.get("/:name", async (request, response) => {
   console.log(request.params.name)
   const result = await Food.find({name: { $regex: request.params.name, $options: 'i' }})
   console.log(result)
   response.json(result)
})

      foodRouter.post("/", async (request, response) => {
   const body = request.body

   const resultNumber = ((body.ew/body.kcal)*54+(body.ballast/body.kcal)*39)*10+(100/body.kcal)*16-((body.fett/body.kcal)*600)-(body.zucker/body.kcal)*160 
   var rounded = Math.round((resultNumber + Number.EPSILON) * 100) / 100;
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
      rate: result
   })

   const savedFood = await food.save()
   response.status(200)
   response.json(savedFood)
})

module.exports = foodRouter