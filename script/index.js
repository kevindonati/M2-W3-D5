const urlProdotti = "https://striveschool-api.herokuapp.com/api/product/"
const key =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWUxZGNmZjczOWY4NzAwMTU3YWIwN2UiLCJpYXQiOjE3NzY0MDk4NTUsImV4cCI6MTc3NzYxOTQ1NX0._LLto04D8OlrfDB9KoGpAyaaNUCnSYDAEqzEOSQClRI"

const recuperaProdotto = () => {
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
      const spinner = document.querySelector(".spinner-border")
      spinner.classList.add("d-none")

      console.log(data)

      const contenitore = document.getElementById("contenitore-prodotti")
      for (let i = 0; i < data.length; i++) {
        contenitore.innerHTML += `
        <div class="col">
         <a class=text-decoration-none href="./pagina-dettaglio.html?id=${data[i]._id}">
            <div class="card border border-1 border-light shadow bg-black">
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
              <ul class="list-group list-group-flush ">
                <li class="list-group-item bg-black">Brand: ${data[i].brand}</li>
                <li class="list-group-item bg-black">Prezzo: ${data[i].price}€</li>
              </ul>
            </div>
            </a>
          </div>
        `
      }
    })
    .catch((err) => {
      console.log("errore fetch:", err)
    })
}
recuperaProdotto()
