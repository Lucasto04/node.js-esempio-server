import {
  exists,
  getLibraryForBook,
  removeBookFromLibrary,
  addBookToLibraryAndSave,
} from "./db.js";

export const addBookToLibrary = async (req, res) => {
  // "/libraries/:libraryId/books/:bookId"

  let libraryId = req.params.libraryId;
  let bookId = req.params.bookId;

  // controllare se library esiste
  if (!(await exists("libraries", libraryId))) {
    return res.status(404).send({ status: "error" });
  }
  // controllare se book esiste
  if (!(await exists("books", bookId))) {
    return res.status(404).send({ status: "error" });
  }

  // cosa dobbiamo fare se book e' gia' dentro library?
  // non permettere di aggiungerlo
  // 409 https://httpstatuses.io/409
  let libraryContainingBook = await getLibraryForBook(bookId);
  if (libraryContainingBook && libraryContainingBook.id == libraryId) {
    return res
      .status(409)
      .send({ status: "error", msg: "book already in this library" });
  }

  console.log(libraryContainingBook);

  // cosa dobbiamo fare se book e' dentro un'altra library?
  if (libraryContainingBook) {
    // togliere il libro da quella library
    removeBookFromLibrary(libraryContainingBook.id, bookId);
  }

  // aggiungiamo il libro alla library
  addBookToLibraryAndSave(libraryId, bookId);

  res.json({ status: "ok" });
};
