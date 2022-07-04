const Mongoclient = require("mongodb").MongoClient
const helper = require("./utils/for_testing")
let array
const url = "mongodb://tilman:K4k4k4n4k!@localhost:27017/?authSource=admin"
console.log("connecting...")
Mongoclient.connect(url, async function(err, db) {
   if (err) throw err
   const dbo = db.db("natursatt")
   
   await dbo.collection("importListen").find({}).limit(1).toArray((err, result) => {
      
      
      array = result.map(item => {
      
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

   })
   console.log(array)
})

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