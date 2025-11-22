// loads environment variables from spcified location
const { loadEnvFile } = require('node:process');
loadEnvFile('./bg_rad_backend/keys.env');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@raddatacluster.wnxk9ca.mongodb.net/?appName=radDataCluster`

const dbName = "test";
const colName = "radData";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/**
 * Performs the db.find command on database using query specified
 * @param {Object} query mongoDB query used to find items
 * @returns array of items found
 */
async function dbItemFind(query){
  try {
    await client.connect();
    const dbCol = await client.db(dbName).collection(colName);

    const cursor = await dbCol.find(query).limit(10);
    return await cursor.toArray();

  } catch(err){
    console.error(err);
  }
}

async function closeDbConnection(){
  await client.close();
}

/**
 * Selects all items in DB than contain specified substring either 
 * name, country, or subNational feild 
 * @param {string} subString sub-string to find in feilds 
 * @returns array of selected items
 */
const selectItemsBySubString = async (subString) => {
  const regPtn = {$regex: `(?i)${subString}`};
  const query = {
    $or: [
      {name: regPtn},
      {country: regPtn},
      {subNational: regPtn},
    ]
  };

  return await dbItemFind(query);
}

/**
 * Selects item in DB with ObjectId specified
 * @param {string} id item ID as string
 * @returns array containg object with id, empty array if item not found
 */
const selectItemById = async (id) => {
  const query = {_id: new ObjectId(id)};
  return await dbItemFind(query);
}

module.exports = {
  selectItemById,
  selectItemsBySubString,
  closeDbConnection
};


