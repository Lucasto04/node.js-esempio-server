async function prendoRes() {
  let res = await fetch("https://fakestoreapi.com/products/1", {
    method: "GET",
  });
  let json = await res.json();
  console.log(res);
}
prendoRes();

// fetch("flowers.jpg")
//   .then((response) => response.blob())
//   .then((blob) => {
//     const objectURL = URL.createObjectURL(blob);
//     image.src = objectURL;
//   });

// let res = await fetch("qualcosa")
// let blob = await res.blob()
// faccio qualcosa con blob
