let searchResults = document.getElementById("search__outcome")
let moviesHTML  = ""
let movieHTML = ""


let savedMovies = JSON.parse(localStorage.getItem('movie'))
console.log(savedMovies)

async function render(){
  for(const item of savedMovies){
    const res = await fetch(`https://www.omdbapi.com/?i=${item}&apikey=eedb40e&plot=full`)
    const data = await res.json()
    
    movieHTML  = `
    <div class="flex movie_div watch_div" id="${data.imdbID}">
    <img class="poster" src="${data.Poster}" width="200px" hight="400px"/>
    <div class="movie_info">
    <div class="flex movie_title">
    <h1>${data.Title}</h1><span class="rating"><i class="fa-solid fa-star"></i>${data.imdbRating}</span>
    </div>
    <div class="movie_intro">
    <p>${data.Runtime}</p>
    <p>${data.Genre}</p>
    <button class="watchlist_btn" id="${data.imdbID}"><i class="fa-solid fa-circle-minus"></i>Remove</button>
    </div>
    <div class="movie__plot">
    <p class="plot color_accent_darker">${data.Plot}</p>
    <span class="read_more">Read more</span>   
         
    </div>
    </div>
    </div>           
    `
    moviesHTML += movieHTML
    searchResults.innerHTML = moviesHTML
   
   
    //Read more buttons
    let plots = document.getElementsByClassName("plot")
    let limit = 250     
    let readmoreBtns = document.getElementsByClassName("read_more")
    

    for(let plot of plots) {
     if(plot.innerText.length > limit) {
       plot.classList.add("plot_trunc")
       plot.nextElementSibling.style.display = "inline"
     }
    }

    for(let btn of readmoreBtns) {
     btn.addEventListener("click", function(e) {
      let currentPlot = e.target.previousElementSibling
      currentPlot.classList.toggle("plot_trunc")
       if(!currentPlot.classList.contains("plot_trunc")){
         btn.innerText = "Read less"
       }else {
         btn.innerText = "Read more"
       }
     })
    }

    let removeBtns = document.querySelectorAll(".watchlist_btn")
    removeBtns.forEach(removeBtn => {
      removeBtn.addEventListener("click", () => {
        let imdbID = removeBtn.id
        document.getElementById(`${imdbID}`).remove()

        let movieDelete = savedMovies.indexOf(imdbID)
        savedMovies.splice(movieDelete, 1)
                
        localStorage.removeItem('movie')
        localStorage.setItem('movie', JSON.stringify(savedMovies))
      })
    })
  }
}
render()