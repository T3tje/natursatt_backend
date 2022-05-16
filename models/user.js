const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
   name: {type: String, required: true, unique:true },
   email: {type: String, required: true},
   passwordHash: String,
   foodsAdded: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Food"
      }
   ],
   foodsSaved: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Food"
      }
   ]
})

userSchema.set("toJSON", {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject.__v
   }
})

const User = mongoose.model("User", userSchema)

module.exports = User