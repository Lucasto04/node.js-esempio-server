async function invia() {
  let res = await fetch("http://localhost:3000/long-task", {
    method: "POST",
  });
  let json = await res.json();
  console.log(json.status, res.status);
}
invia();
