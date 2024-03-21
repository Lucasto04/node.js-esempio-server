async function invia() {
  let res = await fetch("http://localhost:3000/books", {
    method: "POST",
    headers: {
      token: "h725",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "19824",
      author: "George Orwell",
      description: "dystopic world",
      publisher: "boh",
    }),
  });
  let json = await res.json();
  console.log(res.status, json);
}
invia();
