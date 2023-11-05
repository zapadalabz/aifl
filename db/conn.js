const { MongoClient } = require("mongodb");
const Db = process.env.DATABASE_URL;
const Db_name = process.env.DATABASE_NAME;
const client = new MongoClient(Db);
 
var _db;
 
module.exports = {
  connectToServer: async function (callback) {
    try {
        await client.connect();
      } catch (e) {
        console.error(e);
      }
  
      _db = client.db(Db_name);
      console.log("Connected to Mongo.")
      return (_db === undefined ? false : true);
    },
    getDb: function () {
      return _db;
    },
};