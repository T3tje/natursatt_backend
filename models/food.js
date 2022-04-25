const mongoose = require("mongoose")

const foodSchema = new mongoose.Schema({
   name: {type: String, required: true, unique:true },
   kh: {type: Number, required: true},
   ew: {type: Number, required: true},
   fett: {type: Number, required: true},
   ballast: {type: Number, required: true},
   zucker: {type: Number, required: true},
   rate: {type: String, required: true},
   likes: {type: Number, required: false},
   kcal: {type: Number, required: true},
   barcode: {type: Number, required: false},
   picLink: {type: String, required: false},
   zusatzstoffe: {type: Boolean, required: false },
   affiLink: {type: String, required: false}
})

foodSchema.set("toJSON", {
   transform:(document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
   }
})

module.exports = mongoose.model("Food", foodSchema)