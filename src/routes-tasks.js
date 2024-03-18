import { readDb, taskChanged } from "./db.js";

let idTask = 1;
export function longTasks(req, res) {
  taskChanged(idTask, true);
  res.status(202).json({ status: "ok" });

  //diciamo a js che deve aspettare (in millisecondi
  //dopodichè potrà usare la funzione anonima messa come parametro
  setTimeout(() => {
    taskChanged(idTask, false);
  }, 60000);
  idTask++;
}
