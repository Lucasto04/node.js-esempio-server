async function invia() {
  let res = await fetch(`http://localhost:3000/undo`, {
    method: "PUT",
  });
  let json = await res.text();
  console.log(json, res.status);
}
invia();
