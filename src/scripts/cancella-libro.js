async function invia(id) {
  let res = await fetch(`http://localhost:3000/books/${id}`, {
    method: "DELETE",
  });
  let json = await res.json();
  console.log(json.status, res.status);
}
invia(1);
