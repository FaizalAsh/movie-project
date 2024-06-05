const API_KEY = `fe5a0e41fbc8c02fe35cb5f059b1afba`
const image_path = `https://image.tmdb.org/t/p/w1280`

const input = document.querySelector(".search input") // isma search ko select kiya 
const button = document.querySelector(".search button") // then we fetch input button 
const main_grid_title = document.querySelector(".favorites h1") // then we fetch h1 favorites
const main_grid = document.querySelector(".movies-grid") // THEN WE FETCH MOVIE GRID 
const popup_container = document.querySelector(".popup-container")

async function getmoviebysearch(search_term) {  // async function keep trying karta rehta ha bettern than normal function 

     
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search_term}`);
        console.log(response.statusText) // response.statustext mean this will tell you whether api giving response or not 
       
    
        const data = await response.json();// its important to convert the data to json 
        console.log(data)
        console.log(data.results);


        return data.results;  // return isliya kiya because we are transfering information to another function 
  
}




button.addEventListener('click', addsearchmovie)

async function addsearchmovie() {
    const data = await getmoviebysearch(input.value)
   console.log(data)
    main_grid_title.innerText = `Search results` // DID NOT UNDERSTAND 
    main_grid.innerHTML = data.map(e => {    // YE HAM LOOP CHALA RAHA HA OBJECT MA THROUGH MAP 
        return `<div class="card" data-id="${e.id}">                           // YE CARD HA WE GOT IT FROM HTML                               
        <div class="img"><img
                src='${image_path+e.poster_path}'       // WE CHANGED EVERYTHING ON INSPECT KARKA API DEKH SAKTA HA 
                alt="">
        </div>

        <div class="info">
            <h2>${e.title}</h2>

            <div class="single-info">
                <span>rate:</span>
                <span>${e.vote_average}</span>
            </div>
            <div class="single-info">
                <span>release date:</span>
                <span>${e.release_date}</span>
            </div>
        </div>
    </div>

        
        `
    }).join('') // ye backtick ko remove kara sakta ha if that shows in the screen 
  
    const cards = document.querySelectorAll('.card') // THEN WE FETCH CARD 

   


    addclickeffecttocard(cards) // CARD FUCNTION CALL KIYA HA 70 NUMBER WALA 

    
}

function addclickeffecttocard(cards){

    cards.forEach(card => {                   //.forEach CHALAENGA BECAUSE WE HAVE  HAVE TO RUN MULTIPLE  CARDS YE 1 CARD SAB JAGAH CHALAGA THROUGH .FOREACH
        card.addEventListener('click',()=>
          showpopup(card) //YE showpopup FUCNTION CALL KIYA HA 94 NUMBNER LINE WALA FUNCTION 
        )
        
    });
   

}

async function get_movie_by_id (id) {
    const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`) // FROM WHERE DID WE GET THE LINK ??? 
    const respData = await resp.json() // HERE WE CONVERTED DATA TO JSON 
    
    return respData // WE MADE A RETURN 
}






async function showpopup(card){ 
    popup_container.classList.add('show-popup')  // EXPLAIN HERE ?? 
    const movie_id = card.getAttribute('data-id') // DID WE ADD THE THE DATA ID ?? EXPLAIN
    const movie = await get_movie_by_id(movie_id) // EXPLAIN ???
   
    
    
   popup_container.style.background= `linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 1)), url(${image_path+movie.poster_path})`
   popup_container.innerHTML=` <span class="x-icon">&#10006;</span>
   <div class="content">
       <div class="left">
           <div class="poster-img">
               <img src='${image_path+movie.poster_path}' alt="">
           </div>
           <div class="single-info">
               <span>Add to favorites:</span>
               <span class="heart-icon">&#9829;</span>
           </div>
       </div>
       <div class="right">
           <h1>${movie.title}</h1>
           <h3>${movie.tagline}</h3>
           <div class="single-info-container">
               <div class="single-info">
                   <span>Language:</span>
                   <span>${movie.spoken_languages[0].name}</span>
               </div>
               <div class="single-info">
                   <span>Length:</span>
                   <span>${movie.runtime}</span>
               </div>
               <div class="single-info">
                   <span>Rate:</span>
                   <span>${movie.vote_average}</span>
               </div>
               <div class="single-info">
                   <span>Budget:</span>
                   <span>${movie.budget}</span>
               </div>
               <div class="single-info">
                   <span>Release Date:</span>
                   <span>${movie.release_date}</span>
               </div>
           </div>
           <div class="genres">
               <h2>Genres</h2>
               <ul>
                   ${movie.genres.map(e=>
                    `<li>${e.name}</li>`
                   ).join('')}
               </ul>
           </div>
           <div class="overview">
               <h2>Overview</h2>
               <p>${movie.overview}</p>
           </div>
           
       </div>
   </div> 
   
   `
   const x_icon = document.querySelector('.x-icon') // WE FETCH X ICON HERE    

   x_icon.addEventListener('click',()=>

    popup_container.classList.remove('show-popup') // WE REMOVE the pop up fucntion here 



   )

   const heart_icon = document.querySelector('.heart-icon')    // here we fetch the heart icon 

   heart_icon.addEventListener('click',()=>{
    if (!heart_icon.classList.contains('change-color'))
    {  add_to_ls(movie_id)

        heart_icon.classList.add('change-color')
        
        }
    else{ 
       remove_ls(movie_id)
        heart_icon.classList.remove('change-color')
    }
   
    fetch_favorite_movies()

   })

   
   
}

function get_ls(){
    const movie_ids = JSON.parse(localStorage.getItem('movie-id'))
    return movie_ids === null?[]:movie_ids
}

function add_to_ls(id){

    const movie_ids = get_ls()
    localStorage.setItem('movie-id', JSON.stringify([...movie_ids, id])) // if we want to push it to local storage then we will have to use JSON.stringify 
                                                                              // ... name of the vairable from where we are getting the data from local storage -- this makes the copy of the array which is inside the local storage 
     }
 
function remove_ls(id){
    const movie_ids = get_ls()
    localStorage.setItem('movie-id',JSON.stringify(movie_ids.filter(e=>e!==id))) // have to explain later 
}

fetch_favorite_movies()
async function fetch_favorite_movies (){
    main_grid.innerHTML='' // 
    const movie_ls = await get_ls()
    const movies = []

    for(let i=0; i<=movie_ls.length-1; i++){
         
        const movie_id = movie_ls[i]
    
        let movie = await get_movie_by_id(movie_id)
        add_favorites_to_dom_from_ls(movie)
        movies.push(movie)
    }


}

function add_favorites_to_dom_from_ls(movie_data){
    main_grid.innerHTML+=`<div class="card" data-id="${movie_data.id}">                               
    <div class="img"><img
            src='${image_path+movie_data.poster_path}'
            alt="">
    </div>

    <div class="info">
        <h2>${movie_data.title}</h2>

        <div class="single-info">
            <span>rate:</span>
            <span>${movie_data.vote_average}</span>
        </div>
        <div class="single-info">
            <span>release date:</span>
            <span>${movie_data.release_date}</span>
        </div>
    </div>
</div>

    
    `
    const cards = document.querySelectorAll('.card')

   


    addclickeffecttocard(cards)// ye kyu likha yaha ??? 

}
