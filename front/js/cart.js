let cart__items = document.querySelector("#cart__items");
let items = JSON.parse(localStorage.getItem("commande_items"));

if (items < 1) {
  let cartAndFormContainer = document.querySelector("#cartAndFormContainer");
  cartAndFormContainer.innerHTML = "<h1>Votre panier est vide</h1>";
}
else {

  for (let item of items) {
    fetch("http://127.0.0.1:3000/api/products/" + item.id)
      .then(function (res) {
        if (res.ok) {
          return res.json()
        }
      })
      .then(function (produit) {

        //Insertion article//
        let article = document.createElement("article");
        cart__items.appendChild(article);
        article.classList.add("cart__item");

        //Insertion div img //
        let div = document.createElement("div");
        article.appendChild(div);
        div.classList.add("cart__item__img");

        //Insertion img //
        let img = document.createElement("img");
        div.appendChild(img);
        img.src = produit.imageUrl;
        img.alt = produit.altTxt;

        //Insertion div cart__item__content, __description (+ h3 et paragraphes) //

        let divContent = document.createElement("div");
        article.appendChild(divContent);
        divContent.classList.add("cart__item__content");

        let divDetail = document.createElement("div");
        divContent.appendChild(divDetail);
        divDetail.classList.add("cart__item__content__description");

        let h3 = document.createElement("h3");
        divDetail.appendChild(h3)
        h3.innerHTML = produit.name;

        let pColor = document.createElement("p");
        divDetail.appendChild(pColor)
        pColor.innerHTML = item.color;

        let pPrix = document.createElement("p");
        divDetail.appendChild(pPrix)
        pPrix.innerHTML = produit.price + " €";

        //Insertion div quantité/suppression produit

        let divSettings = document.createElement("div");
        divContent.appendChild(divSettings)
        divSettings.classList.add("cart__item__content__setting")

        let pQuantity = document.createElement("p");
        divSettings.appendChild(pQuantity)
        pQuantity.innerHTML = "Qté : ";

        let divInput = document.createElement("div");
        divSettings.appendChild(divInput)
        divInput.classList.add("cart__item__content__settings__quantity")

        let input = document.createElement("input");
        divInput.appendChild(input);
        input.value = item.quantity;
        input.setAttribute("type", "number");
        input.classList.add("itemQuantity")
        input.setAttribute("name", "itemQuantity");
        input.setAttribute("min", "1");
        input.setAttribute("max", "100");

        let divDelete = document.createElement("div");
        divSettings.appendChild(divDelete)
        divDelete.classList.add("cart__item__content__settings__delete")

        let pDelete = document.createElement("p");
        divDelete.appendChild(pDelete);
        pDelete.classList.add("deleteItem");
        pDelete.innerHTML = "Supprimer";

        function calculTotal() {
          //-----------------------------Affichage du prix et de la quantité totale------------------------

          //Sélection des quantités présentes dans le panier 
          let inputQuantity = document.getElementsByClassName("itemQuantity");

          //Réccupération des valeurs
          let quantityLength = inputQuantity.length,
            totalQuantite = 0;

          //Boucle pour chercher les quantités
          for (let y = 0; y < quantityLength; y++) {
            totalQuantite += inputQuantity[y].valueAsNumber;
          }
          //Le code html 
          let totalQuantity = document.querySelector("#totalQuantity");
          totalQuantity.innerHTML = totalQuantite;

          // Variable pour réccupérer les prix présents dans le panier
          //let prixTotalCalcul = [];

          //Boucle pour chercher les prix dans le panier et multiplication avec quantités
          for (let y = 0; y < items.length; y++) {
            let totalPrix = produit.price;
            console.log(totalPrix)

            //Mettre les prix dans la variable "prixTotaleCalcul"
            //prixTotalCalcul.push(totalPrix);
            //console.log(prixTotalCalcul)
            
          }
          //Addition des prix
          const reducer = (accumulator, currentValue) => accumulator + currentValue;
          const prixTotal = totalPrix.reduce(reducer, 0);

          //Le code html
          //let totalPrice = document.querySelector("#totalPrice");
          //totalPrice.innerHTML = prixTotal;
          console.log(prixTotal)

        }
        calculTotal();

        //-----------------------------------------------Modifier qtité------------------------------------
        function modification() {
          let modifItem = document.querySelectorAll(".itemQuantity");


          for (let q = 0; q < modifItem.length; q++) {
            modifItem[q].addEventListener("change", (event) => {
              event.preventDefault();

              let modifQt = items[q].quantity;
              let modifInput = modifItem[q].valueAsNumber;

              modifFind = items.filter((el) => el.modifInput !== modifQt);

              modifFind.quantity = modifInput;
              items[q].quantity = modifFind.quantity;

              localStorage.setItem("commande_items", JSON.stringify(items));

              //Alert produit supprimé et refresh dela page 
              alert("Votre panier a bien été modififié");
              location.reload();

            })
          }
        }
        modification();
        //------------------------------------------Supprimer des produits par couleur id-------------------------
        function suppresion() {
          let deleteItem = document.querySelectorAll(".deleteItem");

          for (let l = 0; l < deleteItem.length; l++) {
            deleteItem[l].addEventListener("click", (event) => {
              event.preventDefault();
              //sélection de l'id/couleur du produit à supprimer en cliquant sur le bouton + filtre 
              let idDelete = items[l].id;
              let colorDelete = items[l].color;

              items = items.filter(el => el.id !== idDelete || el.color !== colorDelete);

              localStorage.setItem("commande_items", JSON.stringify(items));

              //Alert produit supprimé et refresh dela page 
              alert("Ce produit a bien été supprimé du panier");
              location.reload();
            })
          }
        }
        suppresion();

      })
      .catch(function (err) {
        // Une erreur est survenue
      });

  }


  //---------------------------------Validation formulaire------------------------------------
  function formulaire() {

    //Sélection du button commander 
    const btnCommander = document.querySelector("#order");

    //addEventListener
    btnCommander.addEventListener("click", (e) => {
      e.preventDefault();

      //Création d'un objet pour réccupérer des valeurs du formulaire 
      const formValues = {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        address: document.querySelector("#address").value,
        city: document.querySelector("#city").value,
        email: document.querySelector("#email").value
      }


      //-----------------------------Gestion validation du formulaire----------------------
      //Création d'un objet pour déterminer l'input non valide (nom, prénom ou vile)
      const textAlert = (value) => {
        return `${value}: Doit contenir entre 3 et 20 caractères(de A-Z)`;
      }
      //RegEx pour le nom, le prénom et la ville
      const regExPrenomNomVille = (value) => {
        return /^[A-Za-z '-]{3,20}$/.test(value);
      }

      //RegEx pour l'adresse mail 
      const regExEmail = (value) => {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
        //src : https://regexr.com/3e48o
      }

      //RegEx pour l'adresse postale
      const regExAddress = (value) => {
        return /^[A-Za-z0-9\s]{5,55}$/.test(value);
      }

      function prenomControle() {
        //Contrôle validité du prénom
        const lePrenom = formValues.firstName;
        if (regExPrenomNomVille(lePrenom)) {
          document.querySelector("#firstNameErrorMsg").textContent = "";
          return true;
        } else {
          document.querySelector("#firstNameErrorMsg").textContent = "Veuillez remplir ce champ";
          alert(textAlert("Prénom"));
          return false;
        }
      };

      function nomControle() {
        //Contrôle validité du nom
        const leNom = formValues.lastName;
        if (regExPrenomNomVille(leNom)) {
          document.querySelector("#lastNameErrorMsg").textContent = "";
          return true;
        } else {
          document.querySelector("#lastNameErrorMsg").textContent = "Veuillez remplir ce champ";
          alert(textAlert("Nom"));
          return false;
        }
      };

      function addressControle() {
        //Contrôle validité de l'email
        const lAddress = formValues.address;
        if (regExAddress(lAddress)) {
          document.querySelector("#addressErrorMsg").textContent = "";
          return true;
        } else {
          document.querySelector("#addressErrorMsg").textContent = "Veuillez remplir ce champ";
          alert("Veuillez renseigner une adresse postale valide (sans symboles, entre 5 et 55 caractères)");
          return false;
        }
      };

      function cityControle() {
        //Contrôle validité de la ville
        const laVille = formValues.city;
        if (regExPrenomNomVille(laVille)) {
          document.querySelector("#cityErrorMsg").textContent = "";
          return true;
        } else {
          document.querySelector("#cityErrorMsg").textContent = "Veuillez remplir ce champ";
          alert(textAlert("Ville"));
          return false;
        }
      }
      function emailControle() {
        //Contrôle validité de l'email
        const laVille = formValues.email;
        if (regExEmail(laVille)) {
          document.querySelector("#emailErrorMsg").textContent = "";
          return true;
        } else {
          document.querySelector("#emailErrorMsg").textContent = "Veuillez remplir ce champ";
          alert("L'adresse mail n'est pas valide (exemple@domaine.fr)");
          return false;
        }
      };


      //Contrôle de la validité du form avant envoi vers le LocalStorage
      if (prenomControle() && nomControle() && cityControle() && emailControle() && addressControle()) {
        //Mettre l'objet formValue dans le localStorage 
        localStorage.setItem("formValues", JSON.stringify(formValues));
      } else {
        alert("Veuillez remplir correctement le formulaire")
      }

      let idItems = [];
      for (let s = 0; s < items.length; s++) {
        idItems.push(items[s].id);
        console.log(idItems)
      }

      //Mettre les valeurs du formulaire et des produits sélectionnés dans un objet à envoyer vers le serveur
      const order = {

        contact: formValues,
        products: idItems,
      }

      //Envoi de l'objet "order" vers le serveur 
      const options = {
        method: 'POST',
        body: JSON.stringify(order),
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json"
        }
      };
      console.log(options)

      fetch("http://localhost:3000/api/products/order", options)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          localStorage.clear();
          localStorage.setItem("orderId", data.orderId);


          document.location.href = "confirmation.html";
        })
        .catch((err) => {
          alert("Erreur dans la requête : " + err.message);
        });


    })

  }
  formulaire();
}

