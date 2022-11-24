import { MongoClient } from "mongodb";

let DB;
async function connectToDB(server) {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  await client.connect();
  DB = client.db("react-blog-db");
  server();
}

export { DB, connectToDB };
