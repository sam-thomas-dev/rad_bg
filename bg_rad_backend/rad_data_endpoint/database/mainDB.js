// loads environment variables from spcified location
const { loadEnvFile } = require('node:process');
loadEnvFile('./bg_rad_backend/keys.env');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

class mongoDbApi{
  constructor(){
    throw new Error("mongoDbApi class can not be instantiated");
  }
  static #uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@raddatacluster.wnxk9ca.mongodb.net/?appName=radDataCluster`

  static #dbName = "test";
  static #colName = "radData";
  
  static #defLat = -25.034912926102326;
  static #deflng = 134.27791178447652;

  static errorObj = { 
    _id: -1, 
    name: "Error", 
    country: "records found", 
    subNational: "no", 
    radFig: "0", 
    radUnit: "xXx", 
    latitude: this.#defLat, 
    longitude: this.#deflng
  };


  /**
   * Performs the db.find command on database using query specified
   * @param {Object} query mongoDB query used to find items
   * @param {number} itemLimit max number of items to return
   * @returns array of items found
   */
  static dbItemFind = async (query, itemLimit) => {
    try {
      const client = new MongoClient(this.#uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
    
      await client.connect();
      const dbCol = client.db(this.#dbName).collection(this.#colName);
      const cursor = dbCol.find(query).limit(itemLimit);
      
      const result = await cursor.toArray() ?? [this.errorObj];
      if(!result){
        return [this.errorObj];
      } else{
        await client.close();
        return result;
      }
    
    } catch(error){
      console.error(error);
    }
  }


  /**
   * Selects all items in DB than contain specified substring either 
   * name, country, or subNational feild 
   * @param {string} subString sub-string to find in feilds 
   * @returns array of selected items
   */
  static selectItemsBySubString = async (subString) => {
    const regPtn = {$regex: `(?i)${subString}`};
    const query = {
      $or: [
        {name: regPtn},
        {country: regPtn},
        {subNational: regPtn},
      ]
    };

    try{
      const result = await this.dbItemFind(query, 10) ?? [this.errorObj];
      if(!result){
        return [this.errorObj];
      } else{
        return result;
      }

    } catch(error){
      console.log(error);
    }
  }

  /**
   * Selects item in DB with ObjectId specified
   * @param {string} id item ID as string
   * @returns array containg object with id, empty array if item not found
   */
  static selectItemById = async (id) => {
    const query = {_id: new ObjectId(id)};

    try{
      const result = await this.dbItemFind(query, 10) ?? [this.errorObj];
      if(!result){
        return [this.errorObj];
      } else{
        return result;
      }

    } catch(error){
      console.log(error);
    }
  }

  /**
   * Selects all items from DB with country name specified
   * @param {string} countryName name of country as string
   * @returns {Array} array containing all items returned by selection
   */
  static selectItemByCountry = async (countryName) => {
    const query = {country: countryName};
    
    try{
      const result = await this.dbItemFind(query, 15) ?? [this.errorObj];
      if(!result){
        return [this.errorObj];
      } else{
        return result;
      }

    } catch(error){
      console.log(error);
    }
  }
}

module.exports = mongoDbApi;



