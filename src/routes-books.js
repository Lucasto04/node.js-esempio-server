import { readDb, updateStats } from "./db.js";
import { connect, close, createBook } from "./mongodb-connection.js";

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

export const create = async (req, res) => {
  // TODO gestire con MONGODB
  //let titleExists = await bookTitleExists(req.body.title);
  let titleExists = false;
  if (bookIsValid(req.body) && !titleExists) {
    // req.body è un oggetto
    // se book inviato da utente è valido (libro dentro req.body)
    // scrivi su db solo se ci sono tutti i dati previsti (bookIsValid)
    await createBook(req.body);
    res.status(201).json({ status: "ok" });
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
