async function invia(id) {
  let res = await fetch(`http://localhost:3000/books/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "1984",
      author: "George Orwell",
      description: "dystopic world",
      publisher: "Quel Publisher",
    }),
  });
  let json = await res.json();
  console.log(json.status, res.status);
}
invia(1);
