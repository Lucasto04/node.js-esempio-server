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

// quando arriva una chiamata che contiene delle informazioni in JSON
// allora prendi quello stream di dati e convertilo in JSON appunto
// questo risultato mettilo dentro l'attributo req.body
app.use(bodyParser.json());

app.post("/books", create);
// :id vuol dire
// qualsiasi cosa tu, utente del mio server, scrivi dopo books/ mettila dentro una
// variabile che puo' essere accduta tramite req.params
app.get("/books/:id", getSingle);
app.get("/books", getAll);
app.put("/books/:id", updateSingle);
app.delete("/books/:id", deleteSingle);

// library
// endpoint per aggiungere un libro ad una libreria
// endpoint per muovere un libro da una libreria ad un'altra
// endpoint per prendere in prestito un libro\

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
