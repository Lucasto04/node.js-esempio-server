import fs from "node:fs/promises";

export async function readDb() {
  let content = await fs.readFile("./db.json");
  let stringContent = content.toString();
  let db = JSON.parse(stringContent);
  return db;
}

export async function exists(collection, id) {
  let db = await readDb();
  let foundElements = db[collection].filter((element) => element.id == id);
  return foundElements.length > 0;
}

export async function getLibraryForBook(bookId) {
  // controllare in tutte le library se hanno questo bookid
  let db = await readDb();
  let libraries = db.libraries;
  for (let i = 0; i < libraries.length; i++) {
    let books = libraries[i].books;
    if (books.indexOf(bookId) > -1) {
      return libraries[i];
    }
  }
  return null;
}

export async function saveLibraries(libraries) {
  let db = await readDb();
  db.libraries = libraries;
  await fs.writeFile("./db.json", JSON.stringify(db));
}

// assume che la libreria identifdicata da libraryId esista
export async function removeBookFromLibrary(libraryId, bookId) {
  let db = await readDb();
  let libraries = db.libraries;
  let library = libraries.find((lib) => lib.id == libraryId);
  // si puo' fare anche con la slice
  let otherBooks = library.books.filter((bid) => bid != bookId);
  library.books = otherBooks;
  saveLibraries(libraries);
}

export async function addBookToLibraryAndSave(libraryId, bookId) {
  let db = await readDb();
  let libraries = db.libraries;
  let library = libraries.find((lib) => lib.id == libraryId);
  library.books.push(bookId);
  saveLibraries(libraries);
}
