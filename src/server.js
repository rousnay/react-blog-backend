import fs from "fs";
import admin from "firebase-admin";
import express from "express";
import { DB, connectToDB } from "./db.js"; //need to add *.js because we enabled module in package.json file.

const credentials = JSON.parse(fs.readFileSync("credentials.json"));

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());
app.use(async (req, res, next) => {
  const { authToken } = req.headers;

  console.log("token", authToken);
  if (authToken) {
    try {
      req.user = await admin.auth().verifyIdToken(authToken);

      console.log("use", user.user);
    } catch (e) {
      res.sendStatus(400);
    }
  }
  next();
});

app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;
  const article = await DB.collection("articles").findOne({ name });

  if (article) {
    res.json(article);
  } else {
    res.sendStatus(404);
  }
});

app.put("/api/articles/:name/upvotes", async (req, res) => {
  const { name } = req.params;
  const articles = DB.collection("articles");
  const article = await articles.findOne({ name });

  if (article) {
    await articles.updateOne({ name }, { $inc: { upvotes: 1 } });
    const updatedArticle = await articles.findOne({ name });
    res.json(updatedArticle);
  } else {
    res.sendStatus(404);
  }
});

app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;
  const articles = DB.collection("articles");
  const article = await articles.findOne({ name });

  if (article) {
    await articles.updateOne(
      { name },
      { $push: { comments: { postedBy, text } } }
    );
    const updatedArticle = await articles.findOne({ name });
    res.json(updatedArticle);
  } else {
    res.sendStatus(404);
  }
});

connectToDB(() => {
  console.log("Successfully connect to the database!");
  app.listen(8000, () => {
    console.log("Server is listening to port 8000");
  });
});
