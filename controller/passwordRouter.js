const passwordRouter = require("express").Router()
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const config = require("../utils/config")
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
      
      const token = jwt.sign(userDataForToken, secret, { expiresIn: 60 * 5})  // 5 Minuten
     
      const emailLink = `${config.OWN_URL}/authentication/newpassword?frame=${token}?frame=${user.id}`
      
      
      const subject = "Passwort wiederherstellen"
      const htmlContent = `
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Neucha&family=Secular+One&family=Sigmar+One&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Neucha&family=Open+Sans:wght@300&family=Secular+One&family=Sigmar+One&display=swap');
      </style>
      <div style=" margin-top: 37px; color:#6aa84f; font-size: 43px; font-family: 'Neucha', Arial, sans-serif; text-align: center;">Passwort zurücksetzen</div>
      <p style="color:#554544; font-size: 18px; font-family: 'Open Sans', Arial, sans-serif; text-align: center;">Bitte klicke auf den folgenden Link (5 Minuten gültig), um Dein neues Passwort festzulegen:</div>
      <div style="margin-top: 20px; margin-bottom: 100px; text-align: center">
         <a style="color: #ffffff; text-decoration: none; background-color: #6aa84f; border-style: none; padding: 13px 20px 10px 20px; border-radius: 25px; font-family: 'Neucha', Arial, sans-serif; font-size: 25px" href="${emailLink}">Passwort erneuern</a>
      </div>`
      
      sendInBlue.sendEmail(email, subject, htmlContent)

      response.status(200).send()
      
   }   else {

      response.status(400).json({
         error: "E-Mail Adresse nicht vorhanden"
      })
   }
   
   
})

module.exports = passwordRouter

