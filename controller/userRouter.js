const bcrypt = require("bcrypt")
const userRouter = require("express").Router()
const User = require("../models/user")

userRouter.get("/", async (request, response) => {
   const users = await User.find({})
   response.json(users)
})

userRouter.post("/", async (request, response) => {
   const { username, name, password, email } = request.body
   
   //eslint-disable-next-line
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")

   const existingUserName = await User.findOne({ username })

   if (existingUserName) {
      return response.status(400).json({
         error: "Benutzername bereits vergeben"
      })
   }

   const existingEmail = await User.findOne({ email })

   if (existingEmail) {
      return response.status(400).json({
         error: "E-Mail Adresse bereits vergeben"
      })
   }
  
   if (strongRegex.test(password) === false) {
      return response.status(400).json({
         error: "Das Passwort (mindestens 8 Zeichen lang) sollte enthalten: Einen Großbuchstaben, ein Sonderzeichen (!@#$%^&*), eine Zahl."
      })
   }
   const saltRounds = 10
   const passwordHash = await bcrypt.hash(password, saltRounds)

   const user = new User({
      username,
      name,
      passwordHash,
      email
   })
   const savedUser = await user.save()

   response.status(201).json(savedUser)
})

module.exports = userRouter

