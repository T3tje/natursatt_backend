const Mongoclient = require("mongodb").MongoClient
const helper = require("./utils/for_testing")

const url = "mongodb://localhost:27017/"
console.log("connecting...")
Mongoclient.connect(url, function(err, db) {
   if (err) throw err
   const dbo = db.db("natursatt")
   const query = {lang: "de"}

   dbo.collection("openfoodfacts").find(query).limit(100).toArray((err, result) => {
      if (err) throw err
      
      const array = result.map(item => {
         if (item.product_name 
               && item.nutriments.carbohydrates_100g
               && item.nutriments.fat_100g
               && item.nutriments.proteins_100g
               && item.nutriments.energy_value
               && item.nutriments.fiber
               && item.nutriments.sugars_100g
         ) {

            const body = {
               ew: item.nutriments.proteins_100g,
               ballast: item.nutriments.fiber,
               kcal: item.nutriments.energy_value,
               fett: item.nutriments.fat_100g,
               zucker:item.nutriments.sugars_100g,
            }

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
            return {
               name: item.product_name,
               kh: item.nutriments.carbohydrates_100g,
               fett: item.nutriments.fat_100g,
               ew: item.nutriments.proteins_100g,
               kcal: item.nutriments.energy_value,
               ballast: item.nutriments.fiber,
               zucker:item.nutriments.sugars_100g,
               openfoodfacts: true,
               new:false,
               rate: helper.getRate(body)
            }   
         }
      }).filter(item => item)
      console.log(array)
      db.close()
   })
})