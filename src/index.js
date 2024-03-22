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
import {
  readDb,
  swap,
  isAuthenticated,
  updateStats,
  updateUnauthorized,
  deleteTasks,
} from "./db.js";
import { longTasks } from "./routes-tasks.js";
import { getUrl } from "./routes-dimensions.js";

import { runJob } from "./jobs/sync-images-sizes.js";

// quando arriva una chiamata che contiene delle informazioni in JSON
// allora prendi quello stream di dati e convertilo in JSON appunto
// questo risultato mettilo dentro l'attributo req.body
app.use(bodyParser.json());

// dentro gli headers della req controlliamo il token dell'utente
// se il token consente di fare questa chiamata, chiamiamo next
// altrimenti ritorniamo uno status opportuno

function updatePath(req, res, next) {
  updateStats(req.method + " " + req.path);
  next();
}
app.use(updatePath);

async function requireAutentication(req, res, next) {
  // ciclare su tutti gli utenti
  // per quelli che hanno questo token, controlliamo se possono vedere questa rotta

  if (await isAuthenticated(req.headers, req.path)) {
    next();
  } else {
    updateUnauthorized();
    res.status(401).json({ status: "error", msg: "not authorized" });
  }
}
app.post("/books", requireAutentication, create);
// :id vuol dire
// qualsiasi cosa tu, utente del mio server, scrivi dopo books/ mettila dentro una
// variabile che puo' essere accduta tramite req.params
app.get("/books/:id", getSingle);
app.get("/books", getAll);
app.put("/books/:id", requireAutentication, updateSingle);
app.delete("/books/:id", requireAutentication, deleteSingle);

// library
// endpoint per muovere un libro da una libreria ad un'altra
// endpoint per prendere in prestito un libro

// endpoint per aggiungere un libro ad una libreria
app.post(
  "/libraries/:libraryId/books/:bookId",
  requireAutentication,
  addBookToLibrary
);

app.put("/undo", requireAutentication, function (req, res) {
  swap();
  return res.json({ status: "ok" });
});

app.get("/stats", async (req, res) => {
  let db = await readDb();

  res.status(200).json({ status: "ok", stats: db.stats });
});

app.post("/long-task", longTasks);

app.get("/dimensions", getUrl);

app.listen(port, () => {
  deleteTasks();
  // 60000 qua e' messo a "caso", in uno scenario reale e' bene dimensionarlo in base
  // alla frequenza di aggiornamento del dato che stiamo sincronizzando
  // runJob(60000);
  console.log(`Example app listening on port ${port}`);
});
