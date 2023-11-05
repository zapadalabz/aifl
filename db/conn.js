const { MongoClient } = require("mongodb");
const Db = process.env.DATABASE_URL;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
var _db;
 
module.exports = {
  connectToServer: async function (callback) {
    try {
        await client.connect();
      } catch (e) {
        console.error(e);
      }
  
      _db = client.db("BH");
      console.log("Connected to Mongo.")
      return (_db === undefined ? false : true);
    },
    getDb: function () {
      return _db;
    },
};