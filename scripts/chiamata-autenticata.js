async function invia(bookid) {
  let res = await fetch("http://localhost:3000/books", {
    method: "GET",
    headers: {
      token: "h725",
    },
  });
  let json = await res.json();
  console.log(json.status, res.status);
}
invia(1);
