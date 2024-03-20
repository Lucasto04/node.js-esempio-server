import { readDb, taskChanged } from "./db.js";

let idTask = 1;
export async function longTasks(req, res) {
  let currentId = idTask;
  await taskChanged(currentId, true);
  res.status(202).json({ status: "ok" });

  //diciamo a js che deve aspettare (in millisecondi
  //dopodichè potrà usare la funzione anonima messa come parametro
  setTimeout(async () => {
    await taskChanged(currentId, false);
  }, 60000);
  idTask++;
}
