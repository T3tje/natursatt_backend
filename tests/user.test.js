const bcrypt = require("bcrypt")
const User = require("../models/user")
const helper = require("../utils/for_testing")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)

describe("when there is initially one user in db", () => {
   beforeEach(async () => {
      await User.deleteMany({})
 
      const passwordHash = await bcrypt.hash("T3stpassword!", 10)
      const user = new User({ 
         name: "Tilman",
         passwordHash,
         email: "tilman2013@gmail.com"
      })
 
      await user.save()
   }, 10000)
 
   test("creation succeeds with a fresh user", async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
         name: "Tetje",
         password: "anotherPasw4ord!",
         email:"tilman2013@googlemail.com"
      }
     
      
      await api
         .post("/api/users")
         .send(newUser)
         .expect(201)
         .expect("Content-Type", /application\/json/)
 
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
 
      const emails = usersAtEnd.map(u => u.email)
      expect(emails).toContain(newUser.email)
   }, 10000)
 

   test("creation fails with a proper statuscode and message email is already in use", async () => {
      
      const usersAtStart = await helper.usersInDb()

      const newUser = {
         
         name: "Superuser",
         password: "T3stpassworrt",
         email:"tilman2013@gmail.com"
      }

      const result = await api
         .post("/api/users")
         .send(newUser)
         .expect(400)
         .expect("Content-Type", /application\/json/)

      expect(result.body.error).toContain("E-Mail wird bereits verwendet")

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
   })

   test("PASSWORD TO SHORT", async () => {
      
      const usersAtStart = await helper.usersInDb()

      const newUser = {
         name: "viererMax",
         password: "sala!N3",
         email:"tilmasdasdan2012@gmail.com"
      }

      const result = await api
         .post("/api/users")
         .send(newUser)
         .expect(400)
         .expect("Content-Type", /application\/json/)

      expect(result.body.error).toContain("Das Passwort (mindestens 8 Zeichen lang) sollte enthalten: Einen Großbuchstaben, ein Sonderzeichen (!@#$%^&*), eine Zahl.")

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
   })

   test("PASSWORD OHNE SONDERZEICHEN", async () => {
      
      const usersAtStart = await helper.usersInDb()

      const newUser = {
         name: "5Max",
         password: "salasN3123f",
         email:"tilmasdan2011@gmail.com"
      }

      const result = await api
         .post("/api/users")
         .send(newUser)
         .expect(400)
         .expect("Content-Type", /application\/json/)

      expect(result.body.error).toContain("Das Passwort (mindestens 8 Zeichen lang) sollte enthalten: Einen Großbuchstaben, ein Sonderzeichen (!@#$%^&*), eine Zahl.")

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
   })

   test("PASSWORD OHNE GROßBUCHSTABE", async () => {
      
      const usersAtStart = await helper.usersInDb()

      const newUser = {
      
         name: "6Max",
         password: "sala!d3123f",
         email:"tilsmans2010@gmail.com"
      }

      const result = await api
         .post("/api/users")
         .send(newUser)
         .expect(400)
         .expect("Content-Type", /application\/json/)

      expect(result.body.error).toContain("Das Passwort (mindestens 8 Zeichen lang) sollte enthalten: Einen Großbuchstaben, ein Sonderzeichen (!@#$%^&*), eine Zahl.")

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
   })

   test("PASSWORD OHNE ZAHL", async () => {
      
      const usersAtStart = await helper.usersInDb()

      const newUser = {
         
         name: "8Max",
         password: "sala!dsSdf",
         email:"tilmsan2090@gmail.com"
      }

      const result = await api
         .post("/api/users")
         .send(newUser)
         .expect(400)
         .expect("Content-Type", /application\/json/)

      expect(result.body.error).toContain("Das Passwort (mindestens 8 Zeichen lang) sollte enthalten: Einen Großbuchstaben, ein Sonderzeichen (!@#$%^&*), eine Zahl.")

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
   })

   test("PASSWORD EXAKT works", async () => {
      
      const usersAtStart = await helper.usersInDb()

      const newUser = {
   
         name: "6Max",
         password: "s!lasN3123f",
         email:"tilmasdasdasan2021@gmail.com"
      }

      await api
         .post("/api/users")
         .send(newUser)
         .expect(201)
         .expect("Content-Type", /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
 
      const emails = usersAtEnd.map(u => u.email)
      expect(emails).toContain(newUser.email)
   })

   test("LOGIN IS FOLLOWED BY GETTING A TOKEN", async () => {

      const newUser = {
         email: "tilman2013@gmail.com",
         password: "T3stpassword!",
      }

      const result = await api
         .post("/api/login")
         .send(newUser)
         .expect(200)
         .expect("Content-Type", /application\/json/)

      
      expect(result.body.token).not.toBe(undefined)
   })
})