let listeProducts = document.querySelector("#listeProducts");
let form = document.querySelector("#product-form");

//class Product qui sera le prototype des autres avec 2 functions statics pour calculer la TVA et la Marge
class Product {
  constructor(type, nom, priceHT, salepriceHT, quantite) {
    this.type = type;
    this.nom = nom;
    this.priceHT = priceHT;
    this.salepriceHT = salepriceHT;
    this.quantite = quantite;
  }
  static calculTVA(salepriceHT) {
    let tvavalue = (Number(salepriceHT) / 100) * 20;
    Number(tvavalue);
                                                        //console.log("saleprice HT VALUE" + Number(salepriceHT));
                                                        //console.log("TVA VALUE" + Number(tvavalue));
    let prixTTC = Number(salepriceHT) + Number(tvavalue);
    //parseInt(prixTTC, 10);
    console.log("PRIX TTC : " + prixTTC);
    return prixTTC.toFixed(2); // changement marge parseint
  }

  static calculMarge(priceHT, salepriceHT) {
      console.log("price ht :" + priceHT);
    //changement enlever les donnes
    let marge = Number(salepriceHT) - Number(priceHT);
   // Number(marge);
    console.log("Marge : " + marge);
    return marge.toFixed(2); // changement marge parseint
  }
}
// Classe pour tous les produits qui ont un degré d'alcool
class ProdAlcohol extends Product {
  constructor(type, nom, priceHT, salepriceHT, quantite, degalc) {
    super(type, nom, priceHT, salepriceHT, quantite);
    this.degalc = degalc;
  }
  static calculTVA(salepriceHT) {
    let tvavalue = (Number(salepriceHT) / 100) * 20;
    Number(tvavalue);
    let prixTTC = Number(salepriceHT) + Number(tvavalue);
    console.log("PRIX TTC : " + prixTTC);
    return prixTTC.toFixed(2); // changement TVA
  }

  static calculMarge(priceHT, salepriceHT) {
    //changement enlever les donnes
    let marge = salepriceHT - priceHT;
    console.log("marge : " + marge);
    Number(marge);
    return marge.toFixed(2); // changement marge parseint
  }
}

// appel de local storage pour afficher ce quil a dedans, sinon le tableau est vide
productArray = [];
productArray = JSON.parse(localStorage.getItem("produits"));
if (productArray) {
  showProducts();
} else {
  productArray = [];
}

// formulaire pour l' ajout d'un product. Il ecoute le button submit et appelle une callback
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let data = new FormData(e.target);

  var prod;
  if (data.get("quantite") <=0){  //changement Quantite doit etre superiore a ZERO sinon ne sauvegarde pas
      alert("La quantité ne peux pas etre inférieur a 0 !")
  } else {

    if (data.get("type") == "alcohol") {
        prod = new ProdAlcohol(
          data.get("type"),
          data.get("nom"),
          data.get("priceHT"),
          data.get("salepriceHT"),
          data.get("quantite"),
          data.get("degalc")
        );
        console.log(data.get("quantite"));
      } else {
        prod = new Product(
          data.get("type"),
          data.get("nom"),
          data.get("priceHT"),
          data.get("salepriceHT"),
          data.get("quantite")
        );
      }
    
      console.log(prod);
      productArray.push(prod);
      alert("Produit ajouté à la liste")
    
      saveProduct();
      showProducts();
      editProd();
  }

  
});

//function pour sauvegarder dans LocalStorage. Appelé quand on enregistre, moifie ou delete un product
function saveProduct() {
  const stringProducts = JSON.stringify(productArray);
  localStorage.setItem("produits", stringProducts);
}
//function qui affiche les produits, affichage differente pour chaque objet et en function de la quantité de produit
//Si quantite < 10, il est affiche en rouge
function showProducts() { // changement if auqntite stock negatif
  let productDiv = document.querySelector("#listeProducts");
  let liste = "";

  productArray.forEach((prod, code) => {
      
        if (prod.type == "alcohol" && prod.quantite <= 10) {
            liste += ` 
            <div class="new-liste">
            <p>
              <strong>Type de Produit : ${prod.type}</strong> <br />
              Nom : ${prod.nom}
              <br />
              <span class="quantite-rouge"> Quantité : ${prod.quantite} </span>
              <br />
              Prix d'achat HT : ${prod.priceHT} €
              <br/>
              Prix de Vente HT : ${prod.salepriceHT} €
              <br/>
              Prix de vente TTC : ${Product.calculTVA(prod.salepriceHT)} €
              <br/>
              Marge : ${Product.calculMarge(prod.priceHT, prod.salepriceHT)} €
              <br />
              Taux d'alcool : ${prod.degalc} 
              
              <div class="boutons">
              <br /><br /><button class="deleteButton" onClick="window.location.reload();"> Supprimer </button><br />
              <br /><button class="changeButton"><a href="#modif"> Editer </a></button>
              </div>
              <br /><button class="btnCode" id="btnCode"><a href="#pageQr"> Generer QRCode </a></button><br />            
          </p>
          </div>`;
      
            // changement button delete refresh page dans les 2 buttons
            productDiv.innerHTML = liste;
          } else if (prod.type == "alcohol" && prod.quantite > 10) {
            liste += ` 
            <div class="new-liste"><p>
              <strong>Type de Produit : ${prod.type}</strong> <br />
              Nom : ${prod.nom}
              <br />
              Quantité : ${prod.quantite}
              <br />
              Prix d'achat HT : ${prod.priceHT} €
              <br/>
              Prix de Vente HT : ${prod.salepriceHT} €
              <br/>
              Prix de vente TTC : ${Product.calculTVA(prod.salepriceHT)} €
              <br/>
              Marge : ${Product.calculMarge(prod.priceHT, prod.salepriceHT)} €
              <br />
              Taux d'alccol : ${prod.degalc} 
              
              <div class="boutons">
              <br /><br /><button class="deleteButton" onClick="window.location.reload();"> Supprimer </button><br />
              <br /><button class="changeButton"><a href="#modif"> Editer </a></button>
              </div>
              <br /><button class="btnCode" id="btnCode"><a href="#pageQr"> Generer QRCode </a></button><br />
              
          </p></div>`;
      
            // changement button delete refresh page dans les 2 buttons
            productDiv.innerHTML = liste;
          } else if (prod.type != "alcohol" && prod.quantite <= 10){
            liste += ` 
            <div class="new-liste"><p>
              <strong>Type de Produit : ${prod.type}</strong> <br />
              Nom : ${prod.nom}
              <br />
              <span class="quantite-rouge"> Quantité : ${prod.quantite} </span>
              <br />
              Prix d'achat HT : ${prod.priceHT} €
              <br/>
              Prix de Vente HT : ${prod.salepriceHT} €
              <br/>
              Prix de vente TTC : ${Product.calculTVA(prod.salepriceHT)} €
              <br/>
              Marge : ${Product.calculMarge(prod.priceHT, prod.salepriceHT)} €
              
              <br/>
              <br/>
              
              <div class="boutons">
              <br /><br /><button class="deleteButton" onClick="window.location.reload();"> Supprimer </button><br />
              <br /><button class="changeButton"><a href="#modif"> Editer </a></button>
              </div>
              <br /><button class="btnCode" id="btnCode"><a href="#pageQr"> Generer QRCode </a></button><br />
              </p></div>`;
      
            productDiv.innerHTML = liste;
          } else {
            liste += ` <div class="new-liste"><p>
            <strong>Type de Produit : ${prod.type}</strong> <br />
            Nom : ${prod.nom}
            <br />
            Quantité : ${prod.quantite}
            <br />
            Prix d'achat HT : ${prod.priceHT} €
            <br/>
            Prix de Vente HT : ${prod.salepriceHT} €
            <br/>
            Prix de vente TTC : ${Product.calculTVA(prod.salepriceHT)} €
            <br/>
            Marge : ${Product.calculMarge(prod.priceHT, prod.salepriceHT)} €
            
            <br/>
            <br/>
            
            <div class="boutons">
            <br /><br /><button class="deleteButton" onClick="window.location.reload();"> Supprimer </button><br />
            <br /><button class="changeButton"><a href="#modif"> Editer </a></button>
            </div>
            
            <br /><button class="btnCode" id="btnCode"><a href="#pageQr"> Generer QRCode </a></button><br />
            
            </p>
            </div>`;
    
          productDiv.innerHTML = liste;
          }
          newQRCODE(code);
  });

  let deleteButton = document.querySelectorAll(".deleteButton");

  deleteButton.forEach(function (button, index) {
    button.addEventListener("click", () => {
      productArray.splice(index, 1);

      saveProduct();
    });
  });
}

//function pour editer un produit. Le button appelle la function upadate et refresh la page
function editProd() {
  let txtChange = document.querySelector("#txtChange");
  let editTxt = "";
  let changeButton = document.querySelectorAll(".changeButton");

  changeButton.forEach((button, index) => {
    button.addEventListener("click", function () {
      console.log("voila le PRODUCT a modifier :");
      console.log(productArray[index]);
      var indexUP = index;
      console.log(index);
      console.log("productArray type =>");
      console.log(productArray[index].type);

      if (productArray[index].type == "alcohol") {
        editTxt = `
          <div id="formulario-edit">
          <form id="product-form-edit">
              <ul>
              <li>
                  <select id="select" name="type">
                  <option value="">--------Veuillez choisir une option svp--------</option>
                      <option id="alcohol" value="alcohol">Alcohol</option>
                      <option id="soft" value="soft">Soft</option>
                      <option value="autre">Autre</option>
                  </select>
              </li>
              <li>
                  <label for="name">Nom :</label>
                  <input id="newName" type="text" name="nom" value="${productArray[index].nom}">
              </li>
              <li>
                  <label for="quantite">Unités :</label>
                  <input id="newQuantite" type="number" name="quantite" value="${productArray[index].quantite}">
              </li>
              <li>
                  <label for="priceHT">Prix achat HT :</label>
                  <input id="newPriceHT" type="number" name="priceHT" value="${productArray[index].priceHT}">
              </li>
    
              <li>
                  <label for="salepriceHT">Prix vente HT :</label>
                  <input id="newSalepriceHT" type="number" name="salepriceHT" value="${productArray[index].salepriceHT}">
              </li>
              <li>
                  <label for="degalc">Taux d'alcool :</label>
                  <input id="newDegalc" type="number" name="degalc" value="${productArray[index].degalc}" >
              </li>
    
              <li>
              <button type="submit" class="submit-button" value="Update" onClick="window.location.reload();"> Update </button>
              </li>
              </ul>
          </form>`;
        txtChange.innerHTML = editTxt;
        console.log(editTxt);
      } else {
        editTxt = `
          <div id="formulario-edit">
          <form id="product-form-edit">
              <ul>
              <li>
                  <select id="newSelect" name="type">
                  <option value="">-------Veuillez choisir une option svp-------</option>
                      <option id="alcohol" value="alcohol">Alcohol</option>
                      <option id="soft" value="soft">Soft</option>
                      <option value="autre">Autre</option>
                  </select>
              </li>
              <li>
                  <label for="name">Nom :</label>
                  <input id="newName" type="text" name="nom" value="${productArray[index].nom}">
              </li>
              <li>
                  <label for="quantite">Unités :</label>
                  <input id="newQuantite" type="number" name="quantite" value="${productArray[index].quantite}">
              </li>
              <li>
                  <label for="priceHT">Prix achat HT :</label>
                  <input id="newPriceHT" type="number" name="priceHT" value="${productArray[index].priceHT}">
              </li>
    
              <li>
                  <label for="salepriceHT">Prix vente HT :</label>
                  <input id="newSalepriceHT" type="number" name="salepriceHT" value="${productArray[index].salepriceHT}">
              </li>
              <li>
              <button type="submit" value="Update" class="submit-button" onClick="window.location.reload();"> Update </button>
              </li>
              </ul>
          </form>`;
        txtChange.innerHTML = editTxt;
        console.log(editTxt);
      }
      
      updateProd(indexUP);
    });
  });
}
// changement AJOUT DE LA FUNCTION UPDATE pour sauvegarder la modification dans l'index selectioné
// indexUp a été recupéré dans le forEach de la function edit
function updateProd(indexUP) {
  let formedit = document.querySelector("#product-form-edit");

  formedit.addEventListener("submit", (e) => {
    e.preventDefault();

    let newdata = new FormData(e.target);

    var newProd;

    if (newdata.get("quantite") <=0){ //changement LA QUANTITE ne peut pas etre = ou inferieure a ZERO
        alert("La quantité ne peux pas etre inférieur a 0 ! Supprimez le produit");
    } else {

        if (newdata.get("type") == "alcohol") {
        newProd = new ProdAlcohol(
            newdata.get("type"),
            newdata.get("nom"),
            newdata.get("priceHT"),
            newdata.get("salepriceHT"),
            newdata.get("quantite"),
            newdata.get("degalc")
        );
        console.log(newdata.get("nom"));
        console.log("IL EST BIEN RENTRE DANS LE NEW DATA TYPE ALCOHOL");
        } else {
        newProd = new Product(
            newdata.get("type"),
            newdata.get("nom"),
            newdata.get("priceHT"),
            newdata.get("salepriceHT"),
            newdata.get("quantite")
        );
        }
        productArray[indexUP] = newProd;
        console.log("Voici le new product apres le update :");
        console.log(newProd);

        alert("Produit modifié et remis dans la liste")


        saveProduct();
    }
  });
}
//function QRCODE
//le parametre code est l'index du forEach de l'affichage et cree un QR code unique pour chaque objet
function newQRCODE(code){
  buttonCode = document.getElementById("btnCode");
  detailproduct = document.getElementById("detail-product");
  txtProduct = "";
  const stringObjectCode = JSON.stringify(productArray[code]);
  console.log("Voici le string do objeto selecionado");
  console.log(stringObjectCode);
  buttonCode.addEventListener("click", function () {
    new QRCode(document.getElementById("qrcode"), `${stringObjectCode}`);
    txtProduct =`<div class="new-liste">
    <br /><p>
              <strong>Type de Produit : ${productArray[code].type}</strong> <br />
              Nom : ${productArray[code].nom}
              <br />
              <span >Quantité : ${productArray[code].quantite} </span>
              <br />
              Prix d'achat HT : ${productArray[code].priceHT} €
              <br/>
              Prix de vente HT : ${productArray[code].salepriceHT} €
              <br/>
              Prix de vente TTC : ${Product.calculTVA(productArray[code].salepriceHT)} €
              <br/>
              Marge : ${Product.calculMarge(productArray[code].priceHT, productArray[code].salepriceHT)} €
              <br /></div>
    `
    detailproduct.innerHTML = txtProduct;
    notreQRCode.clear();
  })
}
// appel des principales functions a la fin
saveProduct();
showProducts();
editProd();
