const mongoose = require("mongoose")

const getSchema = new mongoose.Schema({
   Produkt: {type: String },
   KH: {type: String},
   Protein: {type: String},
   Fett: {type: String},
   Ballastst: {type: String},
   ZuckAlc: {type: String},
   KCAL: {type: String},
   Zusatzstoffe: {type:String}
})

getSchema.set("toJSON", {
   transform:(document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject.__v
   }
})

module.exports = mongoose.model("Get", getSchema, "import")