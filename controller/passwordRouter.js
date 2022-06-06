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
      
      // in die EMAIL SCHREIBEN "LINK IST NUR 5 MINUTEN GÜLTIG"
      
      const subject = "Passwort wiederherstellen"
      const htmlContent = `
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Neucha&family=Secular+One&family=Sigmar+One&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Neucha&family=Open+Sans:wght@300&family=Secular+One&family=Sigmar+One&display=swap');
      </style>
      <div style="color:#6aa84f; font-size: 37px; font-family: 'Open Sans', sans-serif; text-align: center;">Passwort zurücksetzen</div>
      <br/><br/>
      <div style="color:#554544; font-size: 25px; font-family; 'Neucha', sans-serif; text-align: center;">Bitte klicke auf den folgenden Link um Dein neues Passwort festzulegen:</div>
      <br/><br/>
      <a src="${emailLink}">Passwort erneuern</a>`

      sendInBlue.sendEmail(email, subject, htmlContent)

      response.status(200).json(emailLink)
      
   }   else {

      response.status(400).json({
         error: "E-Mail Adresse nicht vorhanden"
      })
   }
   
   
})

module.exports = passwordRouter

