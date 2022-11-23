import express from "express";

const app = express();
app.use(express.json());

app.post("/hello", (req, res) => {
  res.send(req.body.name);
});

app.get("/hello/fName/:fName/lName/:lName", (req, res) => {
  const { fName, lName } = req.params;
  res.send(`Hello ${(fName, lName)}!`);
});

app.listen(8000, () => {
  console.log("Server is listening to port 8000");
});
