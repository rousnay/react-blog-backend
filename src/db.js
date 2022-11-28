import { MongoClient } from "mongodb";

let DB;
async function connectToDB(server) {
  const client = new MongoClient(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.7skbzan.mongodb.net/test`
  );
  await client.connect();
  DB = client.db("react-blog-db");
  server();
}

export { DB, connectToDB };
