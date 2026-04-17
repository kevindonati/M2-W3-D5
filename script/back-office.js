const urlProdotti = "https://striveschool-api.herokuapp.com/api/product/"
const key =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWUxZGNmZjczOWY4NzAwMTU3YWIwN2UiLCJpYXQiOjE3NzY0MDk4NTUsImV4cCI6MTc3NzYxOTQ1NX0._LLto04D8OlrfDB9KoGpAyaaNUCnSYDAEqzEOSQClRI"
const form = document.querySelector("#form")

const allThePrameters = new URLSearchParams(location.search)
const prodottoId = allThePrameters.get("id")

// SCHERMATA BACKOFFICE SE CI ARRIVO TRAMITE IL TASTO MODIFICA
if (prodottoId) {
  fetch(urlProdotti + prodottoId, {
    headers: {
      Authorization: key,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error("errore durante il recupero dei dati del prodotto")
      }
    })
    .then((data) => {
      const nomeProdottoInput = document.getElementById("nome-prodotto")
      const descrizioneInput = document.getElementById("descrizione")
      const marcaInput = document.getElementById("marca")
      const prezzoInput = document.getElementById("prezzo")
      const immagineInput = document.getElementById("immagine")
      const contenitoreBottoni = document.querySelector(".sezione-bottoni")
      const bottoneAggiungi = document.getElementById("bottone-aggiungi")
      const bottoneRefresh = document.getElementById("bottone-refresh")

      nomeProdottoInput.value = data.name
      descrizioneInput.value = data.description
      marcaInput.value = data.brand
      prezzoInput.value = data.price
      immagineInput.value = data.imageUrl

      bottoneAggiungi.innerText = "Modifica"
      bottoneRefresh.classList.add("d-none")
    })
    .catch((err) => {
      console.log("errore nel riempimento del form", err)
    })
}

class Prodotto {
  constructor(_name, _description, _brand, _imageUrl, _price) {
    this.name = _name
    this.description = _description
    this.brand = _brand
    this.imageUrl = _imageUrl
    this.price = _price
  }
}

// CREAZIONE DEL PRODOTTO PRENDENDO I VALORI DEL FORM
form.addEventListener("submit", function (e) {
  e.preventDefault()

  const nomeProdottoInput = document.getElementById("nome-prodotto")
  const descrizioneInput = document.getElementById("descrizione")
  const marcaInput = document.getElementById("marca")
  const prezzoInput = document.getElementById("prezzo")
  const immagineInput = document.getElementById("immagine")

  const name = nomeProdottoInput.value
  const description = descrizioneInput.value
  const brand = marcaInput.value
  const price = prezzoInput.value
  const imageUrl = immagineInput.value

  const creaProdotto = new Prodotto(name, description, brand, imageUrl, price)

  //   IN BASE ALL'URL DICO SE FARE UN POST O UN PUT
  let urlUtilizzato
  if (prodottoId) {
    urlUtilizzato = urlProdotti + prodottoId
  } else {
    urlUtilizzato = urlProdotti
  }

  let method
  if (prodottoId) {
    method = "PUT"
  } else {
    method = "POST"
  }

  //   METTO SULL'API IL PRODOTTO CREATO
  fetch(urlUtilizzato, {
    method: method,
    body: JSON.stringify(creaProdotto),
    headers: {
      "Content-Type": "application/json",
      Authorization: key,
    },
  })
    .then((response) => {
      if (response.ok) {
        alert(prodottoId ? "prodotto aggiornato" : "prodotto aggiunto")
        window.location.href = "back-office.html"
      } else {
        throw new Error("Prodotto rifiutato dal be")
      }
    })
    .catch((err) => {
      console.log("salvataggio del prodotto fallito, errore:", err)
    })
})

// PRENDO E INSERISCO GLI ELEMENTI CREATI ANCHE QUA NEL BACKOFFICE PER POTERLI ELIMINARE E MODIFICARE

let prodottoDaEliminare

const prodottiEsistenti = () => {
  fetch(urlProdotti, {
    headers: {
      Authorization: key,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error("errore nella response")
      }
    })
    .then((data) => {
      const contenitore = document.getElementById("contenitore-prodotti")
      for (let i = 0; i < data.length; i++) {
        contenitore.innerHTML += `
          <div class="col">
            <div class="card">
              <img
                src="${data[i].imageUrl}"
                class="card-img-top"
                alt="foto prodotto"
              />
              <div class="card-body">
                <h5 class="card-title">${data[i].name}</h5>
                <p class="card-text">
                  ${data[i].description}
                </p>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Brand: ${data[i].brand}</li>
                <li class="list-group-item">Prezzo: ${data[i].price}€</li>
              </ul>
              <div class="card-body sezione-bottoni">
                <a href="./back-office.html?id=${data[i]._id}"><button type="button" class="btn btn-warning w-100 mb-2">Modifica</button></a>
              </div>
            </div>
          </div>
        `
      }
      const contenitoreBottoni = document.querySelectorAll(".sezione-bottoni")

      //   COMPORTAMENTO BOTTONE ELIMINA
      for (let i = 0; i < data.length; i++) {
        const buttonElimina = document.createElement("button")
        buttonElimina.classList.add("btn", "btn-danger", "w-100")
        buttonElimina.setAttribute("data-bs-toggle", "modal")
        buttonElimina.setAttribute("data-bs-target", "#eliminaProdotto")
        buttonElimina.innerText = "Elimina"
        buttonElimina.type = "button"
        contenitoreBottoni[i].appendChild(buttonElimina)

        buttonElimina.addEventListener("click", function () {
          prodottoDaEliminare = data[i]._id
        })
      }
    })
    .catch((err) => {
      console.log("errore fetch:", err)
    })
}

const bottoneElimina = document.getElementById("bottone-elimina")
bottoneElimina.addEventListener("click", function () {
  if (!prodottoDaEliminare) return

  fetch(urlProdotti + prodottoDaEliminare, {
    method: "DELETE",
    headers: {
      Authorization: key,
    },
  })
    .then((response) => {
      if (response.ok) {
        window.location.reload()
        alert("prodotto eliminato correttamente")
        contenitore.innerHTML = ""
        prodottiEsistenti()
      } else {
        throw new Error("errore durante l'eliminazione")
      }
    })
    .catch((err) => {
      console.log("errore nella fetch", err)
    })
})

prodottiEsistenti()

const resetForm = () => {
  form.reset()
  alert("Form resettato con successo")
}
