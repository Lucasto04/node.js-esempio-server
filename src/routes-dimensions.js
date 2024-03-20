import { readDb } from "./db.js";
import fs from "node:fs/promises";
export async function getUrl(req, res) {
  let db = await readDb();
  let re = await fetch("https://fakestoreapi.com/products");
  let products = await re.json();

  if (db.dimensions.length == 0) {
    let sum = 0;
    for (let i = 0; i < 5; i++) {
      sum = sum + (await getDimension(products[i].image));
      let mapUrl = {};
      mapUrl.id = products[i].id;
      mapUrl[products[i].image] = await getDimension(products[i].image);
      db.dimensions.push(mapUrl);
      if (i == 4) {
        let mapTotDim = {};
        mapTotDim.totalDimension = sum;
        db.dimensions.push(mapTotDim);
      }
    }

    await fs.writeFile("./db.json", JSON.stringify(db));
    res.status(200).json({ status: "ok", dimensions: db.dimensions });
  } else {
    res.status(200).json({ status: "ok", dimensions: db.dimensions });
  }
}

export async function getDimension(url) {
  let res = await fetch(url);
  let blob = await res.blob();
  return blob.size;
}
