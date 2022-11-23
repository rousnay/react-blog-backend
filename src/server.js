import express from "express";

let articlesInfo = [
  { name: "learn-react", upvotes: 0, comments: [] },
  { name: "learn-node", upvotes: 0, comments: [] },
  { name: "mongodb", upvotes: 0, comments: [] },
];

const app = express();
app.use(express.json());

app.get("/hello/fName/:fName/lName/:lName", (req, res) => {
  const { fName, lName } = req.params;
  res.send(`Hello ${(fName, lName)}!`);
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
