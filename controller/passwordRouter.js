const passwordRouter = require("express").Router()
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const sendInBlue = require("../utils/sendinblue")


passwordRouter.post("/", async (request, response) => {
   const email = request.body.email

   const user = await User.findOne({ email })

   if (user) {

      const userDataForToken = {
         email: user.email,
         id: user.id
      }
      
      //secret to create a real one time link
      const secret = process.env.SECRET + user.passwordHash
      
      const token = jwt.sign(userDataForToken, secret, { expiresIn: 1000 * 60 * 5 })
     
      const emailLink = `localhost/api/resetpassword?token=${token}&id=${user.id}`
      /*  const subject = "Passwort wiederherstellen"
      const emailContent = `Bitte klicke auf den folgenden Link um Dein neues Passwort festzulegen: ${emailLink}`
      const htmlContent = "<h1>Test123</h1><p>Ptest123</p>"
      sendInBlue.sendEmail(email, subject, emailContent) */

      response.status(200).json(emailLink)
      
   }   else {

      response.status(400).json({
         error: "E-Mail Adresse nicht vorhanden"
      })
   }
   
   
})

module.exports = passwordRouter

