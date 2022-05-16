
const Food = require("../models/food")
const User = require("../models/user")

const reverse = (string) => {
   return string
      .split("")
      .reverse()
      .join("")
}
 
const average = (array) => {
   const reducer = (sum, item) => {
      return sum + item
   }
 
   return array.length === 0
      ? 0
      : array.reduce(reducer, 0) / array.length
}

const usersInDb = async () => {
   const users = await User.find({})
 
   return users.map(u => u.toJSON())
}
 
const foodsInDb = async () => {
   const food = await Food.find({})
   return food.map(f => f.toJSON())
}

const getRate = (food) => {
   const resultNumber = ((food.ew/food.kcal)*54+(food.ballast/food.kcal)*39)*10+(100/food.kcal)*16-((food.fett/food.kcal)*600)-(food.zucker/food.kcal)*160 
   var rounded = Math.round((resultNumber + Number.EPSILON) * 100) / 100
   let rateResult = ""
   
   if (rounded >= 39) {
      rateResult = "a"
   }

   if (rounded > 25 && rounded < 39) {
      rateResult = "b"
   }

   if (rounded <= 25 && rounded >= 10) {
      rateResult = "c"
   }

   if (rounded < 10) {
      
      rateResult = "d"
   }
   return rateResult
}

 
module.exports = {
   reverse,
   average,
   usersInDb,
   foodsInDb,
   getRate
}