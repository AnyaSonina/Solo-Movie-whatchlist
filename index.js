const input = document.getElementById("input")
const btn = document.getElementById("btn")
let searchResults = document.getElementById("search__outcome")
let moviesHTML = ""
let movieHTML = ""
let preLocalStorage = []
let getLocalStorage = JSON.parse(localStorage.getItem("movie"))


if (localStorage.length > 0) {
  preLocalStorage = getLocalStorage
}

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault()
    btn.click()
  }
})

async function getHTML() {

  let title = input.value

  const res = await fetch(`https://www.omdbapi.com/?apikey=71889999&t=${title}&s=${title}&plot=full&type`)
  const data = await res.json()

  let dataArray = data.Search

  if(data.Response === "False") {
    input.value = ""
    searchResults.innerHTML = `    
    <h2 class="color__accent error_res">Sorry! We were unable to find what you’re looking for. Please try another search.</h2>
    `
  }else {
    movieHTML = ""
    for (let i = 0; i < dataArray.length; i++) {
      const res = await fetch(`https://www.omdbapi.com/?apikey=71889999&i=${dataArray[i].imdbID}&plot=full`)
      const data = await res.json()

      movieHTML += `
       <div class="flex movie_div">
       <img class="poster" src="${data.Poster}" width="200px" hight="400px"/>
       <div class="movie_info">
       <div class="flex movie_title">
       <h1>${data.Title}</h1><span class="rating"><i class="fa-solid fa-star"></i>${data.imdbRating}</span>
       </div>
       <div class="movie_intro">
       <p>${data.Runtime}</p>
       <p>${data.Genre}</p>
       <button class="watchlist_btn" id="${data.imdbID}"><i class="fa-solid fa-circle-plus"></i>Watchlist</button>
       </div>
       <div class="movie__plot">
       <p  class="plot color_accent_darker">${data.Plot}</p>
       <span class="read_more">Read more</span>      
       </div>
       </div>
       </div>           
       `
      moviesHTML = movieHTML
      searchResults.innerHTML = moviesHTML

      //Read more buttons
      let plots = document.getElementsByClassName("plot")
      let limit = 250

      let readmoreBtns = document.getElementsByClassName("read_more")

      for (let plot of plots) {
        if (plot.innerText.length > limit) {
          plot.classList.add("plot_trunc")
          plot.nextElementSibling.style.display = "inline"
        }
      }

      for (let btn of readmoreBtns) {
        btn.addEventListener("click", function (e) {
          let currentPlot = e.target.previousElementSibling
          currentPlot.classList.toggle("plot_trunc")
          if (!currentPlot.classList.contains("plot_trunc")) {
            btn.innerText = "Read less"
          } else {
            btn.innerText = "Read more"
          }
        })
      }
    }
  }

  let watchlistBtns = document.querySelectorAll(".watchlist_btn")

  for (const watchlistBtn of watchlistBtns) {

    watchlistBtn.addEventListener("click", function adding() {
      let imdbID = watchlistBtn.id
      
      watchlistBtn.innerHTML = preLocalStorage.includes(imdbID) ? `<button class="watchlist_btn">
      <i class="fa-solid fa-check-double"></i>Already there</button>`
      : `<button class="watchlist_btn"><i class="fa-solid fa-circle-check"></i>Added</button>`
      
      if (!preLocalStorage.includes(imdbID))
        preLocalStorage.push(imdbID)
       localStorage.setItem('movie', JSON.stringify(preLocalStorage))
    })
  }
}

btn.addEventListener("click", () => {
  getHTML()
  input.value = ""
}
)

