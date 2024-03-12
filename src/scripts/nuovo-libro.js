async function invia() {
  let res = await fetch("http://localhost:3000/books", {
    method: "POST",
    body: JSON.stringify({ text: "/" }),
  });
  let json = await res.json();
  console.log(json.ciao, res.status);
}
invia();
