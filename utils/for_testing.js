
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
 
module.exports = {
   reverse,
   average,
   usersInDb,
   foodsInDb
}