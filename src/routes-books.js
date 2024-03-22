import { readDb, updateStats } from "./db.js";
import {
  connect,
  close,
  createBook,
  updateBook,
  deleteBook,
} from "./mongodb-connection.js";

export const getAll = async (req, res) => {
  let foundBooks = [];
  let db = await readDb();
  let keys = Object.keys(req.query);
  console.log(db.books);
  if (keys.length == 0) {
    res.json({ status: "ok", books: db.books });
    return;
  }
  for (let j = 0; j < db.books.length; j++) {
    let book = db.books[j];
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (book[key] == req.query[key]) {
        count++;
      }
    }
    if (req.query.choice == "or") {
      if (count > 0) {
        // almeno una condizione e' rispettata
        // OR
        foundBooks.push(book);
      }
    } else {
      //TUTTE le condizioni sono rispettate
      //AND
      if (count == keys.length) {
        foundBooks.push(book);
      }
    }
  }
  res.json({ status: "ok", books: foundBooks });
  // ritormno al client ok e il valore della chiave books
};

export const getSingle = async (req, res) => {
  let db = await readDb();
  // req.params.id e' cio' che viene dopo books/ e rappresenta la scelta
  // dell'id da visualizzare da parte dell'utente
  let book = db.books.find((book) => book.id == req.params.id);
  // oppure con la filter, ma non e' il massimo perche' ottengo un array, quando
  // invece volevo un oggetto
  // let book = db.books.filter((book) => book.id == req.params.id)[0];
  if (book) {
    res.json({ status: "ok", book: book }); // ritormno al client ok e il valore della chiave books
  } else {
    res.status(404).json({ status: "error" });
  }
};

export const deleteSingle = async (req, res) => {
  // mi faccio dare tutti i libri
  // li filtro in modo da ottnere tutti tranne quello selezionato
  // scrivo tutti i libri ottenuti dal filtro
  let [success, data] = await deleteBook(req.params.id);
  if (success) {
    res.status(200).json({ status: "ok", book: data });
  } else {
    res.status(400).json({ status: "error" });
  } // ritormno al client ok e il valore della chiave books
};

export const updateSingle = async (req, res) => {
  // libro da modificare
  // TODO cosa facciamo se il record non c'è?
  let newBookData = req.body;
  if (bookIsValid(newBookData)) {
    let [success, data] = await updateBook(newBookData);
    if (success) {
      res.json({ status: "ok", data: data }); // ritormno al client ok e il valore della chiave books
    } else {
      res.status(400).json({ status: "error" });
    }
  } else {
    res.status(400).json({ status: "error" });
  }
};

export const create = async (req, res) => {
  if (bookIsValid(req.body)) {
    // req.body è un oggetto
    // se book inviato da utente è valido (libro dentro req.body)
    // scrivi su db solo se ci sono tutti i dati previsti (bookIsValid)
    let [success, data] = await createBook(req.body);
    if (success) {
      res.status(201).json({ status: "ok", id: data });
    } else {
      res.status(409).json({ status: "error", msg: data.errmsg });
    }
  } else {
    res.status(400).json({ status: "error", msg: "Invalid book attributes" });
  }
};

function bookIsValid(book) {
  let keys = Object.keys(book);
  return (
    keys.length == 4 && // diciamo che l'utente può passarci solo 4 dati/chiavi e
    // che devono essere quelle specificate sotto
    book.title &&
    book.author &&
    book.description &&
    book.publisher
  );
}
