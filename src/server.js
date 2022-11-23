import express from "express";

let articlesInfo = [
  { name: "learn-react", upvotes: 0 },
  { name: "learn-node", upvotes: 0 },
  { name: "mongodb", upvotes: 0 },
];

const app = express();
app.use(express.json());

app.post("/hello", (req, res) => {
  res.send(req.body.name);
});

app.get("/hello/fName/:fName/lName/:lName", (req, res) => {
  const { fName, lName } = req.params;
  res.send(`Hello ${(fName, lName)}!`);
});

app.put("/api/articles/:name/upvotes", (req, res) => {
  const { name } = req.params;

  const articles = articlesInfo.find((article) => article.name === name);

  if (articles) {
    articles.upvotes += 1;
    res.send(
      `The ${articles.name} article now has ${articles.upvotes} upvotes`
    );
  } else {
    res.send(`The article dosn\'t exist!`);
  }
});

app.listen(8000, () => {
  console.log("Server is listening to port 8000");
});
