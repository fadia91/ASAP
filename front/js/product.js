let url = new URL(location.href);
let params = url.searchParams.get("id");

console.log(params);

//Réccupération des articles de l'API
async function getProduit() {
    let resAPI = await fetch(`http://localhost:3000/api/products/${params}`)
    return await resAPI.json();
}

//Affichage des résultats de l'API
async function PagePanier() {
    result = await getProduit()
        .then(function (valueApi) {
            const produit = valueApi;
            console.log(produit);

            let item__img = document.querySelector(".item__img");

            let img = document.createElement("img");
            item__img.appendChild(img);
            img.src = produit.imageUrl;
            img.alt = produit.altTxt;

            let price = document.querySelector("#price");
            price.innerHTML = produit.price;

            let title = document.querySelector("#title");
            title.innerHTML = produit.name;

            let description = document.querySelector("#description");
            description.innerHTML = produit.description;

            let colors = document.querySelector("#colors");

            //i++ = on ajoute 1 a i (donc elle s'execute à chaque fois)
            for (let i = 0; i < produit.colors.length; i++) {

                let option = document.createElement("option");
                option.text = produit.colors[i];
                colors.appendChild(option);
            }
            addToCart();
        })
        .catch(function (err) {
            // Une erreur est survenue
        });
}
PagePanier();

function addToCart() {
    //Sélection de l'élément button, de la couleur et de la quantité pour réccupérer les produits au click
    let button = document.querySelector("#addToCart");

    button.addEventListener('click', function () {
        let color = document.querySelector("#colors").value;
        let quantity = document.querySelector("#quantity").value;
        
        if (quantity < 1 || quantity > 100 || color == "") {
            alert("Veuillez choisir une couleur et une quantité valide")
        }
        else {
            let items = JSON.parse(localStorage.getItem("commande_items"));
            console.log(items);

            //Alert produit supprimé et refresh dela page 
            alert("Ajouté(s) au panier");
            location.reload();

            //items est un array qui contient les infos produit
            if (!items) {
                items = [];
            }
            
            // Si
            let index = items.findIndex(item => item.id == params && item.color == color);
            if (index < 0) {
                addNewItem(color, quantity, items);
            }
            else {
                updateItem(items, quantity, index);
            }
        }
    });
}

//Ajouter un nouveau produit au panier/
function addNewItem(color, quantity, items) {
    let data = {
        id: params,
        color: color,
        quantity: quantity,
    }
    items.push(data)
    localStorage.setItem("commande_items", JSON.stringify(items))
}

// Ajouter un produit du même id et de la même couleur au panier. On incrémente la quantité du produit correspondant dans l’array qui réccupère la dernière valeur//
function updateItem(items, quantity, index) {
    console.log(items[index].quantity)
    let newQuantity = parseInt(items[index].quantity) + parseInt(quantity);
    items[index].quantity = newQuantity;
    localStorage.setItem("commande_items", JSON.stringify(items))
}

