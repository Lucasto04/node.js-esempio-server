async function invia(id) {
  let res = await fetch(`http://localhost:3000/books/${id}`, {
    method: "DELETE",
    headers: {
      token: "h725",
    },
  });
  let json = await res.json();
  console.log(json.status, res.status);
}
invia("65fd56134e680f41b6440d02");
