const mongoose = require("mongoose")

const trackedEventSchema = new mongoose.Schema({
   art: {type: String, required: true},
   date: {type: Date},
   ip: {type: String, required: false}
})

trackedEventSchema.set("toJSON", {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject.__v
   }
})

const TrackedEvent = mongoose.model("TrackedEvent", trackedEventSchema)

module.exports = TrackedEvent