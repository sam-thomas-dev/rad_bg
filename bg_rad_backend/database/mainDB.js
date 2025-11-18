// loads environment variables from spcified location
const { loadEnvFile } = require('node:process');
loadEnvFile('./bg_rad_backend/keys.env');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@raddatacluster.wnxk9ca.mongodb.net/?appName=radDataCluster`;

const dbName = "radData";
const colName = "testData";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try {
        await client.connect();
        console.log("connected to DB");
        
        const dbCol = await client.db(dbName).collection(colName);

        const cursor = await dbCol.find({});

        for await(const item of cursor){
            console.log(item);
        }

    } finally {
        await client.close();
        console.log("connection closed");
    }
}
run().catch(console.error);
