const Food = require("../models/food")
const helper = require("../utils/for_testing")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)

describe("when there is initially one food in db", () => {
   beforeEach(async () => {
      await Food.deleteMany({})
      
      const food = new Food({
         name: "Kakaobohnen",
         kh: 58,
         ew: 20,
         ballast: 33,
         fett: 14,
         zucker: 1.8,
         kcal: 228,
         likes: 0,
         addAmount:0,
         barcode: 0,
         zusatzstoffe: false,
         date: new Date(),
         marke: "Dr. Til",
         veggie: 100
      })

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

      food.rate = rateResult
 
      await food.save()
   }, 10000)
 
   test("creation succeeds with a fresh food", async () => {
      const foodsAtStart = await helper.foodsInDb()

      const newFood = {
         name: "Leinsamen",
         kh: 7.7,
         ew: 22.3,
         ballast: 22.7,
         fett: 36.5,
         zucker: 0,
         kcal: 488,
         likes: 0,
         addAmount:0,
         barcode: 0,
         zusatzstoffe: true,
         date: new Date(),
         marke: "Dr. Til",
         veggie: 50
      }

      const resultNumber = ((newFood.ew/newFood.kcal)*54+(newFood.ballast/newFood.kcal)*39)*10+(100/newFood.kcal)*16-((newFood.fett/newFood.kcal)*600)-(newFood.zucker/newFood.kcal)*160 
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

      newFood.rate = rateResult

      console.log(newFood)
      
      await api
         .post("/api/food")
         .send(newFood)
         .expect(201)
         .expect("Content-Type", /application\/json/)
 
      const foodsAtEnd = await helper.foodsInDb()
      expect(foodsAtEnd).toHaveLength(foodsAtStart.length + 1)
 
      const foodnames = foodsAtEnd.map(u => u.name)
      expect(foodnames).toContain(newFood.name)
   }, 100000)

   test("creation fails when adding a existing food", async () => {
      const foodsAtStart = await helper.foodsInDb()

      const food = {
         name: "Kakaobohnen",
         kh: 58,
         ew: 20,
         ballast: 33,
         fett: 14,
         zucker: 1.8,
         kcal: 228,
         likes: 0,
         addAmount:0,
         barcode: 0,
         zusatzstoffe: false,
         date: new Date(),
         marke: "Dr. Til",
         veggie: 100
      }

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

      food.rate = rateResult
      

      const result = await api
         .post("/api/food")
         .send(food)
         .expect(400)
         .expect("Content-Type", /application\/json/)
      
      expect(result.body.error).toContain("Das Lebensmittel ist bereits in der Datenbank enthalten")
 
      const foodsAtEnd = await helper.foodsInDb()
     
      expect(foodsAtEnd).toEqual(foodsAtStart)
      
   }, 100000)
 
 
})