async function invia() {
  let res = await fetch("http://localhost:3000/books", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "1984",
      author: "George Orwell",
      description: "dystopic world",
      publisher: "boh",
    }),
  });
  let json = await res.json();
  console.log(json.status, res.status);
}
invia();
