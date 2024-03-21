import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";
const uri = process.env.MONGODB_CONNECTION_STRING;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function createBook(book) {
  await connect();
  const result = await client
    .db("Cluster-test")
    .collection("books")
    .insertOne(book);
  console.log(`New book created: ${result.insertedId}`);
  await close();
}

export async function connect() {
  await client.connect();
}

export async function close() {
  await client.close();
}
