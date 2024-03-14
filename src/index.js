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

import { addBookToLibrary } from "./routes-libraries.js";
import { swap, isAuthenticated } from "./db.js";

// quando arriva una chiamata che contiene delle informazioni in JSON
// allora prendi quello stream di dati e convertilo in JSON appunto
// questo risultato mettilo dentro l'attributo req.body
app.use(bodyParser.json());

// dentro gli headers della req controlliamo il token dell'utente
// se il token consente di fare questa chiamata, chiamiamo next
// altrimenti ritorniamo uno status opportuno
app.use(async function (req, res, next) {
  console.log(req.headers, req.path);
  // ciclare su tutti gli utenti
  // per quelli che hanno questo token, controlliamo se possono vedere questa rotta
  if (await isAuthenticated(req.headers, req.path)) {
    next();
  } else {
    res.status(401).json({ status: "error", msg: "not authorized" });
  }
});

app.post("/books", create);
// :id vuol dire
// qualsiasi cosa tu, utente del mio server, scrivi dopo books/ mettila dentro una
// variabile che puo' essere accduta tramite req.params
app.get("/books/:id", getSingle);
app.get("/books", getAll);
app.put("/books/:id", updateSingle);
app.delete("/books/:id", deleteSingle);

// library
// endpoint per muovere un libro da una libreria ad un'altra
// endpoint per prendere in prestito un libro

// endpoint per aggiungere un libro ad una libreria
app.post("/libraries/:libraryId/books/:bookId", addBookToLibrary);

app.put("/undo", function (req, res) {
  swap();
  return res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
