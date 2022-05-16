const Food = require("../models/food")
const helper = require("../utils/for_testing")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const bcrypt = require("bcrypt")
const User = require("../models/user")

let token = ""

describe("when there is initially one food and user in db", () => {
   beforeEach(async () => {

      await User.deleteMany({})
      const testPassword = "T3stpassword!"
      const passwordHash = await bcrypt.hash(testPassword, 10)
      const user = new User({ 
         name: "Tilman",
         passwordHash,
         email: "tilman2013@gmail.com"
      })
 
      await user.save()

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

      food.rate = helper.getRate(food)
 
      await food.save()

      const loginUser = {
         email: user.email,
         password: testPassword
      }

      const result = await api   
         .post("/api/login")
         .send(loginUser)
         .expect(200)
         .expect("Content-Type", /application\/json/)
      
      token = `bearer ${result.body.token}`

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

      newFood.rate = helper.getRate(newFood)

      await api
         .post("/api/food")
         .set("Authorization", token)
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

      food.rate = helper.getRate(food)

      const result = await api
         .post("/api/food")
         .set("Authorization", token)
         .send(food)
         .expect(400)
         .expect("Content-Type", /application\/json/)
      
      expect(result.body.error).toContain("Das Lebensmittel ist bereits in der Datenbank enthalten")
 
      const foodsAtEnd = await helper.foodsInDb()
     
      expect(foodsAtEnd).toEqual(foodsAtStart)
      
   }, 100000)
 
 
})