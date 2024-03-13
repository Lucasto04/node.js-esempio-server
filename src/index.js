import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

import {
  getSingle,
  deleteSingle,
  updateSingle,
  getAll,
  create,
} from "./routes-books.js";

app.use(bodyParser.json());

app.post("/books", create);
// :id vuol dire
// qualsiasi cosa tu, utente del mio server, scrivi dopo books/ mettila dentro una
// variabile che puo' essere accduta tramite req.params
app.get("/books/:id", getSingle);
app.get("/books", getAll);
app.put("/books/:id", updateSingle);
app.delete("/books/:id", deleteSingle);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
