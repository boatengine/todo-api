const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const app = express();
const PORT = 8182;

require("dotenv").config();

app.use(express.json());
app.use(cors());
const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    port: process.env.DBPORT,
  });
};
// Path Get all data
app.get("/todos", async (req, res) => {
  const result = await conn.query("SELECT * FROM mock");
  res.json(result[0]);
});

app.get("/todos/:id", async (req, res) => {
  let id_p = parseInt(req.params.id);
  const result = await conn.query("SELECT * FROM mock WHERE id = ?", id_p);
  res.json(result[0][0]);
});

app.post("/todos", async (req, res) => {
  let body = req.body;
  const result = await conn.query("INSERT INTO mock SET ?", body);
  res.status(200).json({
    name: body.name,
    status: body.status,
    id: result[0].insertId.toString(),
  });
});

app.put("/todos/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  let body = req.body;
  const result = await conn.query("UPDATE mock SET ? WHERE id = ?", [body, id]);
  res.status(200).json({
    Message: "update is ok",
    data: result[0],
  });
});
app.delete("/todos/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  const result = await conn.query("DELETE FROM mock WHERE id = ?", id);
  res.status(200).json({
    Message: "deleted now!!!",
    data: result[0],
  });
});

app.listen(PORT, async () => {
  await initMySQL();
  console.log(`Server runing on port ${PORT}`);
});

module.exports = app;
