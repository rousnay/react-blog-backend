import express from "express";
import { MongoClient } from "mongodb";

const app = express();
app.use(express.json());

app.get("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;

  const client = new MongoClient("mongodb://127.0.0.1:27017");
  await client.connect();
  const db = client.db("react-blog-db");
  const articles = db.collection("articles");
  const articleByName = await articles.findOne({ name });
  // res.send(articles).json();
  res.json(articleByName);
});

app.put("/api/articles/:name/upvotes", (req, res) => {
  const { name } = req.params;
  const article = articlesInfo.find((a) => a.name === name);

  if (article) {
    articles.upvotes += 1;
    res.send(
      `The ${article.name} article now has ${article.upvotes} upvotes!!`
    );
  } else {
    res.send(`The article dosn\'t exist!`);
  }
});

app.post("/api/articles/:name/comments", (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;

  const article = articlesInfo.find((a) => a.name === name);

  if (article) {
    article.comments.push({ postedBy, text });
    res.send(article.comments);
  } else {
    res.send("The article dosn't exist!");
  }
});

app.listen(8000, () => {
  console.log("Server is listening to port 8000");
});
