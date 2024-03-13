import { readDb } from "./db.js";

export const getAll = async (req, res) => {
  let db = await readDb();
  res.json({ status: "ok", books: db.books }); // ritormno al client ok e il valore della chiave books
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
  let db = await readDb();
  let book = db.books.find((book) => book.id == req.params.id);
  if (book) {
    // mi faccio dare tutti i libri
    // li filtro in modo da ottnere tutti tranne quello selezionato
    // scrivo tutti i libri ottenuti dal filtro
    let booksToWrite = db.books.filter((book) => book.id != req.params.id);
    db.books = booksToWrite;
    await fs.writeFile("./db.json", JSON.stringify(db));
    res.json({ status: "ok", book: book }); // ritormno al client ok e il valore della chiave books
  } else {
    res.status(404).json({ status: "error" });
  }
};

export const updateSingle = async (req, res) => {
  let db = await readDb();
  // libro da modificare
  let book = db.books.find((book) => book.id == req.params.id);
  if (book) {
    let newBookData = req.body;
    let titleExists = await bookTitleExists(newBookData.title);
    if (bookIsValid(newBookData) && !titleExists) {
      book.title = newBookData.title;
      book.author = newBookData.author;
      book.description = newBookData.description;
      book.publisher = newBookData.publisher;
      await fs.writeFile("./db.json", JSON.stringify(db));
      res.json({ status: "ok" }); // ritormno al client ok e il valore della chiave books
    } else {
      res.status(400).json({ status: "error" });
    }
  } else {
    res.status(404).json({ status: "error" });
  }
};

let bookId = 1;
let db = await readDb();
if (db.books.length) {
  bookId = db.books[db.books.length - 1].id + 1; // prendo ultimo id dell'array e aumento di uno
} // se non entra nel then allora rimane a 1 quindi non occorre else
export const create = async (req, res) => {
  let db = await readDb();
  let titleExists = await bookTitleExists(req.body.title);
  if (bookIsValid(req.body) && !titleExists) {
    // req.body è un oggetto
    // aggiungere una nuova proprietà a req.body il cui valore è bookId
    req.body.id = bookId;
    // req.body["id"] = bookId
    db.books.push(req.body); // pusho richiesta in books
    // se book inviato da utente è valido (libro dentro req.body)
    // scrivi su db solo se ci sono tutti i dati previsti (bookIsValid)
    await fs.writeFile("./db.json", JSON.stringify(db)); // aggiorno db
    res.status(201).json({ status: "ok" });
    bookId++;
  } else {
    res.status(400).json({ status: "error" });
  }
};

async function bookTitleExists(title) {
  let db = await readDb();
  let books = db.books;
  // tutti i libri che hanno come titolo, title (il parametro)
  let booksWithSameTitle = books.filter((book) => book.title == title);
  return booksWithSameTitle.length > 0;
}

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
