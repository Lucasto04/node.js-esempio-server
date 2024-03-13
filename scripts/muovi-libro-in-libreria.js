async function invia(libraryId, bookId) {
  let res = await fetch(
    `http://localhost:3000/libraries/${libraryId}/books/${bookId}`,
    {
      method: "POST",
    }
  );
  let json = await res.json();
  console.log(json.status, res.status);
}
invia(2, 1);
