import {
  exists,
  getLibraryForBook,
  removeBookFromLibrary,
  addBookToLibraryAndSave,
  readDb,
} from "./db.js";

export const addBookToLibrary = async (req, res) => {
  // "/libraries/:libraryId/books/:bookId"

  let libraryId = parseInt(req.params.libraryId, 10);
  let bookId = parseInt(req.params.bookId, 10);

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

  // cosa dobbiamo fare se book e' dentro un'altra library?
  if (libraryContainingBook) {
    // togliere il libro da quella library
    await removeBookFromLibrary(libraryContainingBook, bookId);
  }

  // aggiungiamo il libro alla library
  await addBookToLibraryAndSave(libraryId, bookId);

  res.json({ status: "ok" });
};
