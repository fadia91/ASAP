//Réccupération des articles de l'API
async function getProduits() {
  let resAPI = await fetch("http://localhost:3000/api/products")
  return await resAPI.json();
}

//Affichage des résultats de l'API
async function loadingPage() {
  result = await getProduits()
    .then(function (valueApi) {
      const products = valueApi;
      console.log(products);

      for (let produit in products) {

        let items = document.querySelector("#items");
        let a = document.createElement("a");
        items.appendChild(a);
        a.href = `product.html?id=${valueApi[produit]._id}`;


        let article = document.createElement("article");
        a.appendChild(article);


        let img = document.createElement("img");
        article.appendChild(img);
        img.src = valueApi[produit].imageUrl;
        img.alt = valueApi[produit].altTxt;


        let h3 = document.createElement("h3");
        article.appendChild(h3);
        h3.innerText = valueApi[produit].name;
        h3.classList.add('productName')

        let p = document.createElement("p");
        article.appendChild(p);
        p.innerText = valueApi[produit].description;
        p.classList.add('productDescription');

      }
    })

    .catch(function (err) {
      // Une erreur est survenue
    });
}
loadingPage();