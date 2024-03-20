/*
fare una chiamata al server fakestoreapi
prendere dalla risposta i dati e utilizzando il codice gia' esistente estrarre le dimensiuoni
salvare su db

dopo n secondi
rifare quanto sopra
*/

import { readDb } from "../db.js";
import fs from "node:fs/promises";

// ogni tot secondi, configurabile dall'esterno come parametro
// esegue updateDb aggiornando appunto il db con le informazioni ritornate da fakestoreapi
export async function runJob(ms) {
  setInterval(updateDb, ms);
  // stessa cosa di, se ripensate a onClick={handleClick} che usiamo in React
  // dovrebbe essere piu' semplice capire perche' queste due scritture sono equivalenti
  /*
  setInterval(function() {
    updateDb()
  }, sec)
  */
}

async function updateDb() {
  console.log("started updating db");
  let dimensions = await getDimensions();
  let db = await readDb();
  db.dimensions = dimensions;
  await fs.writeFile("./db.json", JSON.stringify(db));
  console.log("finished updating db");
}

// fa una chiamata a fakestoreapi prendendo tutti i prodotti
// calcola il peso di ogni singola immagine per prodotto
// e anche il peso totale
async function getDimensions() {
  let response = await fetch("https://fakestoreapi.com/products");
  let products = await response.json();

  // TODO cosa fare se l'api e' giu'?

  let totalDimensions = 0;
  let dimensions = {};
  let images = [];
  for (let i = 0; i < products.length; i++) {
    let product = products[i];
    let imageDimension = await getDimension(product.image);
    totalDimensions = totalDimensions + imageDimension;
    let imageInfo = {};
    imageInfo.id = product.id;
    imageInfo[product.image] = imageDimension;
    images.push(imageInfo);
  }
  dimensions.total = totalDimensions;
  dimensions.images = images;
  return dimensions;
}

async function getDimension(url) {
  let res = await fetch(url);
  let blob = await res.blob();
  return blob.size;
}
