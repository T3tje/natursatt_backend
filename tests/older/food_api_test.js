const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../../app")
const api = supertest(app)

/*
const Food = require("../models/food")

 const initialFoods = [
   {
      name: "Kürbiskerne natur",
      kh: 54,
      ew: 19,
      ballast: 18,
      fett: 19,
      zucker: 0,
      rate: "c",
      likes: 0,
      kcal: 446,
      zusatzstoffe: false
   },
   {
      name: "Milch 1,5% Fett",
      kh: 4.9,
      ew: 3.4,
      ballast: 0,
      fett: 1.5,
      zucker: 4.9,
      rate: "b",
      likes: 0,
      kcal: 47,
      zusatzstoffe: false
   },
   {
      name: "Körniger Frischkäse",
      kh: 1,
      ew: 13,
      ballast: 0,
      fett: 4.3,
      zucker: 0.5,
      rate: "a",
      likes: 0,
      kcal: 95,
      zusatzstoffe: false
   },
   {
      name: "Fruchtjoghurt",
      kh: 14.5,
      ew: 4.1,
      ballast: 0,
      fett: 3.1,
      zucker: 14.2,
      rate: "d",
      likes: 0,
      kcal: 105,
      zusatzstoffe: true
   },
   {
      name: "Frischkäse Kräuter",
      kh: 2.9,
      ew: 5,
      ballast: 0.1,
      fett: 24.2,
      zucker: 2.7,
      rate: "d",
      likes: 0,
      kcal: 251,
      zusatzstoffe: true
   },
   {
      name: "Thunfisch in Öl, abgetropft",
      kh: 0.1,
      ew: 23.8,
      ballast: 0.1,
      fett: 18,
      zucker: 0.1,
      rate: "c",
      likes: 0,
      kcal: 197,
      zusatzstoffe: false
   },
   {
      name: "Lachsfilet, ohne Haut",
      kh: 0.1,
      ew: 19.9,
      ballast: 0,
      fett: 11.2,
      zucker: 0,
      rate: "b",
      likes: 0,
      kcal: 180,
      zusatzstoffe: false
   }
]

beforeEach(async () => {
   await Food.deleteMany({})
   let foodObject = new Food(initialFoods[0])
   await foodObject.save()
   foodObject = new Food(initialFoods[1])
   await foodObject.save()
   foodObject = new Food(initialFoods[2])
   await foodObject.save()
   foodObject = new Food(initialFoods[3])
   await foodObject.save()
   foodObject = new Food(initialFoods[4])
   await foodObject.save()
   foodObject = new Food(initialFoods[5])
   await foodObject.save()
   foodObject = new Food(initialFoods[6])
   await foodObject.save()
   foodObject = new Food(initialFoods[7])
   await foodObject.save()
}) */

test("foods are returned as json", async () => {
   await api
      .get("/api/food")
      .expect(200)
      .expect("Content-Type", /application\/json/)
}, 100000)


test("there are 8 foods", async () => {
   const response = await api.get("/api/food")
 
   expect(response.body).toHaveLength(7)
})

afterAll(() => {
   mongoose.connection.close()
})
 