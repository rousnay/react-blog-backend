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
  const { authtoken } = req.headers;
  if (authtoken) {
    try {
      req.user = await admin.auth().verifyIdToken(authtoken);
    } catch (e) {
      res.sendStatus(400);
    }
  }
  next();
});

app.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
});

app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await DB.collection("articles").findOne({ name });
  if (article) {
    const upvoteIds = article.upvoteIds || [];
    article.canUpvote = uid && !upvoteIds.includes(uid);
    res.json(article);
  } else {
    res.sendStatus(404);
  }
});

app.put("/api/articles/:name/upvotes", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;
  const articles = DB.collection("articles");
  const article = await articles.findOne({ name });

  if (article) {
    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);
    if (canUpvote) {
      await articles.updateOne(
        { name },
        { $inc: { upvotes: 1 }, $push: { upvoteIds: uid } }
      );
      const updatedArticle = await articles.findOne({ name });
      res.json(updatedArticle);
    } else {
      console.log("Already upvoted!");
    }
  } else {
    res.send("That article doesn't exist");
  }
});

app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { email, uid } = req.user;
  const { text } = req.body;

  const articles = DB.collection("articles");
  const article = await articles.findOne({ name });

  if (article) {
    await articles.updateOne(
      { name },
      { $push: { comments: { postedBy: email, text } } }
    );
    const updatedArticle = await articles.findOne({ name });

    const upvoteIds = updatedArticle.upvoteIds || [];
    updatedArticle.canUpvote = uid && !upvoteIds.includes(uid);
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
