const mongoose = require("mongoose")

const foodSchema = new mongoose.Schema({
   name: {type: String, required: true, unique:true },
   marke: {type: String, required: false},
   kh: {type: Number, required: true},
   ew: {type: Number, required: true},
   fett: {type: Number, required: true},
   ballast: {type: Number, required: false},
   zucker: {type: Number, required: true},
   rate: {type: String, required: true},
   likes: {type: Number, required: false},
   kcal: {type: Number, required: true},
   barcode: {type: Number, required: false},
   zusatzstoffe: {type: Boolean, required: false},
   affiLink: {type: String, required: false},
   date: {type: Object},
   veggie: {type: Number, required: true},
   user: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      }
   ],
   addedBy: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      }
   ]
})

foodSchema.set("toJSON", {
   transform:(document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject.__v
   }
})

module.exports = mongoose.model("Food", foodSchema)