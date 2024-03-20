import { readDb } from "./db.js";

export async function getUrl(req, res) {
  let db = await readDb();
  res.status(200).json({ status: "ok", dimensions: db.dimensions });
}
