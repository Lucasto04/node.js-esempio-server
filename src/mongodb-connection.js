import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
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
  try {
    await connect();
    const result = await client
      .db("Cluster-test")
      .collection("books")
      .insertOne(book);
    return [true, result.insertedId];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

export async function updateBook(book) {
  try {
    await connect();
    const result = await client
      .db("Cluster-test")
      .collection("books")
      // il primo parametro serve ad identificare il book da aggiornare
      //il secondo serve ad inserire le modifiche attuate
      .updateOne({ title: book.title }, { $set: book });
    return [true, result.deleteCount];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

export async function deleteBook(id) {
  try {
    await connect();
    const result = await client
      .db("Cluster-test")
      .collection("books")
      // il primo parametro serve ad identificare il book da aggiornare
      //il secondo serve ad inserire le modifiche attuate
      .deleteOne({ _id: new ObjectId(id) });

    return [true, result.modifiedCount];
  } catch (err) {
    console.log("delete", err);
    return [false, err];
  } finally {
    await close();
  }
}
export async function connect() {
  await client.connect();
}

export async function close() {
  await client.close();
}
