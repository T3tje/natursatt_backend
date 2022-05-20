require("dotenv").config()
const MongoStore = require("connect-mongo")


const ONE_MONTH = 1000 * 60 * 60 * 24 * 30
const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === "test"
   ? process.env.TEST_MONGODB_URI
   : process.env.MONGODB_URI

const MAIL_API = process.env.SENDINBLUE_API_KEY

const SESS_LIFETIME = ONE_MONTH

const SECURE_OPT = process.env.NODE_ENV === "development"
   ? false
   : true

const SESSION_OBJ =  {
   name: "sid",
   resave: false,
   saveUninitialized: false,
   secret:process.env.SECRET,
   store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
   }),
   cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: true,
      secure: SECURE_OPT,
   }
}

module.exports = {
   PORT,
   MONGODB_URI,
   MAIL_API,
   SESSION_OBJ

}

