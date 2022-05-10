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
         username: "root", 
         name: "Tilman",
         passwordHash,
         email: "tilman2013@gmail.com"
      })
 
      await user.save()
   }, 10000)
 
   test("creation succeeds with a fresh username", async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
         username: "mrm1ster",
         name: "Tetje",
         password: "T3stpasswort!",
         email:"tilman2013@googlemail.com"
      }
      
      await api
         .post("/api/users")
         .send(newUser)
         .expect(201)
         .expect("Content-Type", /application\/json/)
 
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
 
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
   }, 100000)
 
   test("creation fails with proper statuscode and message if username already taken", async () => {
      
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
         username: "root",
         name: "Superuser",
         password: "T3stpasswo0rt",
         email:"salainen@googlemail.com"
      }
  
      const result = await api
         .post("/api/users")
         .send(newUser)
         .expect(400)
         .expect("Content-Type", /application\/json/)
  
      expect(result.body.error).toContain("Benutzername bereits vergeben")
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
   })

   test("creation fails with a proper statuscode and message email is already in use", async () => {
      
      const usersAtStart = await helper.usersInDb()

      const newUser = {
         username: "root3",
         name: "Superuser",
         password: "T3stpassworrt",
         email:"tilman2013@gmail.com"
      }

      const result = await api
         .post("/api/users")
         .send(newUser)
         .expect(400)
         .expect("Content-Type", /application\/json/)

      expect(result.body.error).toContain("E-Mail Adresse bereits vergeben")

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
   })

    

   test("PASSWORD TO SHORT", async () => {
      
      const usersAtStart = await helper.usersInDb()

      const newUser = {
         username: "root4",
         name: "viererMax",
         password: "sala!N3",
         email:"tilman2012@gmail.com"
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
         username: "root5",
         name: "5Max",
         password: "salasN3123f",
         email:"tilman2011@gmail.com"
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
         username: "root6",
         name: "6Max",
         password: "sala!d3123f",
         email:"tilman2010@gmail.com"
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
         username: "root8",
         name: "8Max",
         password: "sala!dsSdf",
         email:"tilman2090@gmail.com"
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

   test("PASSWORD EXAKT", async () => {
      
      const usersAtStart = await helper.usersInDb()

      const newUser = {
         username: "root6",
         name: "6Max",
         password: "s!lasN3123f",
         email:"tilman2021@gmail.com"
      }

      await api
         .post("/api/users")
         .send(newUser)
         .expect(201)
         .expect("Content-Type", /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
 
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
   })

})