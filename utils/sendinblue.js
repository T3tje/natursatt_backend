const Sib = require("sib-api-v3-sdk")
const config = require("./config.js")
const client = Sib.ApiClient.instance


const sendEmail = (address, subject, text) => {

   const apiKey = client.authentications["api-key"]

   apiKey.apiKey = config.MAIL_API

   console.log(config.MAIL_API)
   const tranEmailApi = new Sib.TransactionalEmailsApi()

   const sender = {
      email: "info@natursatt.de"
   }

   const receivers = [
      {
         email: address,
         name: "www.natursatt.de"
      }
   ]

   tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: subject,
      textContent: text
   })
      .then(
         console.log)
      .catch(console.log)

}

module.exports = {
   sendEmail
}