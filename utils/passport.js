const passport = require("passport")
const localStrategy = require ("passport-local").Strategy
const User = require("../models/user")
const bcrypt = require("bcrypt")

const customFields = {
   usernameField: "email",
}

const veryflyCallback = async (email, password, done) => {
   
   try {
      const user = await User.findOne({email: email})
         
      if(!user) {return done(null, false)}
            
      const isValid = await bcrypt.compare(password, user.passwordHash)
      
      if (isValid) {
         return done(null, user)
      } else {
         return done(null, false)
      }

   } catch (err) {
      done(err)
   }
}

const strategy = new localStrategy(customFields, veryflyCallback)

passport.use(strategy)

passport.serializeUser((user, done) => {
   done(null, user.id)
})


passport.deserializeUser( async (userId, done) => {
   try {
      const user = await User.findById(userId)

      done(null, user)
   } catch (err) {
      done(err)
   }
})



