const urlProdotti = "https://striveschool-api.herokuapp.com/api/product/"
const key =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWUxZGNmZjczOWY4NzAwMTU3YWIwN2UiLCJpYXQiOjE3NzY0MDk4NTUsImV4cCI6MTc3NzYxOTQ1NX0._LLto04D8OlrfDB9KoGpAyaaNUCnSYDAEqzEOSQClRI"

const allTheParameters = new URLSearchParams(location.search)
const prodottoId = allTheParameters.get("id")

const aggiungiProdotto = () => {
  fetch(urlProdotti + prodottoId, {
    headers: {
      Authorization: key,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error("errore recupero dati concerto")
      }
    })
    .then((data) => {
      console.log(data)
      const spinner = document.querySelector(".spinner-border")
      spinner.classList.add("d-none")

      const contenitoreProdotto = document.querySelector(".row")
      contenitoreProdotto.innerHTML = `
      <div class="col-12 col-md-4 px-0">
            <img
              class="w-100 "
              src="${data.imageUrl}"
              alt="Foto prodotto"
            />
          </div>
          <div class="col-12 col-md-8 bg-black d-flex flex-column justify-content-between">
            <h2>${data.name}</h2>
            <p>
              ${data.description}
            </p>
            <p>Brand: ${data.brand}</p>
            <p>Prezzo: ${data.price}€</p>
            <button class="btn btn-primary mb-2">Acquista</button>
          </div>
      `
    })
    .catch((err) => {
      console.log("errore nella fatch", err)
    })
}
aggiungiProdotto()
