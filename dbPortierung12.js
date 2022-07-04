
const helper = require("./utils/for_testing")
const mongoose = require("mongoose")
const Get = require("./models/get")
const Food = require("./models/food")

const url = "mongodb://tilman:K4k4k4n4k!@localhost:27017/natursatt?authSource=admin"
console.log("connecting...")     

const mach = async () => {
   await mongoose.connect(url)
   console.log("connected")
   const alle = await Get.find({})

   const saveArray = alle.map(item => {
      
      const ew = Number(item.Protein.replace(",","."))
      const ballast = Number(item.Ballastst.replace(",","."))
      const kcal = Number(item.KCAL.replace(",","."))
      const fett = Number(item.Fett.replace(",","."))
      const zucker = Number(item.ZuckAlc.replace(",","."))
      const kh = Number(item.KH.replace(",","."))
               
      const body = {
         ew: ew,            
         ballast: ballast,
         kcal:  kcal,
         fett: fett,
         zucker: zucker
      }
          
      return {
         name: item.Produkt,
         kh: kh,
         fett: fett,
         ew: ew,
         kcal: kcal,
         ballast: ballast,
         zucker:zucker,
         new:true,
         rate: helper.getRate(body),
         zusatzstoffe: item.Zusatzstoffe === "!" ? true : false,
         date: new Date(),
         veggie: 0,
      } 
   })
   
   console.log(saveArray)
   await Food.insertMany(saveArray)

   await mongoose.connection.close()
   console.log("closed")
   

  
}

mach()
  



/* const array = result.map(item => {
      
   const ew = Number(item.Protein.replace(",","."))
   const ballast = Number(item.Ballastst[""].replace(",","."))
   const kcal = Number(item.KCAL.replace(",","."))
   const fett = Number(item.Fett.replace(",","."))
   const zucker = Number(item["Zuck+Alc"].replace(",","."))
   const kh = Number(item.KH.replace(",","."))
            
   const body = {
      ew: ew,            
      ballast: ballast,
      kcal:  kcal,
      fett: fett,
      zucker: zucker
   }
       
   return {
      name: item.Produkt,
      kh: kh,
      fett: fett,
      ew: ew,
      kcal: kcal,
      ballast: ballast,
      zucker:zucker,
      new:true,
      rate: helper.getRate(body),
      zusatzstoffe: item.zusatzstoffe === "!" ? true : false,
      date: new Date(),
      veggie: 0,
   } 
})

   
console.log(array)
 */

/* console.log(array) */

/*    db.createUser(
               {
                  user: "tilman",
                  pwd: "K4k4k4n4k!",
                  roles: [ 
                     { role: "userAdminAnyDatabase", db:"admin" },
                     "readWriteAnyDatabase"
                  ]
               }
            ) */