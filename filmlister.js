

const searchList = document.getElementById("searchList");
const searchBar = document.getElementById("searchBar");
const cardContainer = document.getElementById("cardContainer");

searchBar.addEventListener("input", clearSearch);
searchBar.addEventListener("input", populate);

let currentId = "";
let diaryContent = [];

function clearSearch() {
  while (searchList.hasChildNodes()) {
    searchList.removeChild(searchList.firstChild);
  }
}

async function populate() {
  if (searchBar.value === ""){
    return;
  }
  else {
    const firstPartURL = "https://api.themoviedb.org/3/search/movie?api_key=f99dcdb2604d84233a9cf4e3f614828a&language=en-US&query=";
    let query = searchBar.value;

    const requestURL = firstPartURL + encodeURI(query);
    const request = new Request(requestURL);
    const response = await fetch(request);
    const movies = await response.json();



    for (let i=0; i<movies.results.length; i++){

      const title = movies.results[i].title;
      const date = movies.results[i].release_date.slice(0,4);
      const originalLanguage = (movies.results[i].original_language === "en") ? "" : movies.results[i].original_title + ", ";
      const posterPath = movies.results[i].poster_path;


      const searchItem = document.createElement("li");

      searchItem.setAttribute("class", "searchItem");

      const searchItemImg = document.createElement("img");
      searchItemImg.src = "https://image.tmdb.org/t/p/w92/" + posterPath;
      searchItemImg.setAttribute("class", "posterThumbnail");

      const textContainer = document.createElement("div")

      const searchItemTitle = document.createElement("p");
      searchItemTitle.setAttribute("class", "searchItemTitle");
      searchItemTitle.innerHTML = title

      const searchItemMoreInfo = document.createElement("p");
      searchItemMoreInfo.setAttribute ("class", "searchItemMoreInfo");
      searchItemMoreInfo.innerHTML = originalLanguage + " " + date;

      searchItem.appendChild(searchItemImg);
      textContainer.appendChild(searchItemTitle);
      textContainer.appendChild(searchItemMoreInfo);
      searchItem.appendChild(textContainer);
      searchItem.value = movies.results[i].id;


      searchList.appendChild(searchItem);
      searchItem.onclick = showCard;
    }
  }
}

async function showCard() {

  while (cardContainer.firstChild) {
    cardContainer.removeChild(cardContainer.lastChild);
  }

  const url = "https://api.themoviedb.org/3/movie/" + this.value + "?api_key=f99dcdb2604d84233a9cf4e3f614828a";
  const request = new Request(url);
  const response = await fetch(request);
  const movie = await response.json();

  currentId = movie.id;

  let moreInfo = [];

  moreInfo.push(movie.title);
  if(movie.original_language !== "en") moreInfo.push(movie.original_title);
  moreInfo.push(movie.release_date.slice(0,4));
  if (movie.spoken_languages.length >= 1) moreInfo.push(movie.spoken_languages[0].english_name);

  moreInfo.push(movie.overview);

  const cardImg = document.createElement("img");
  cardImg.src = "https://image.tmdb.org/t/p/w780" + movie.backdrop_path;
  cardImg.setAttribute("id", "cardImg");

  const cardInfo = document.createElement("ul");
  cardInfo.setAttribute("id", "cardInfo");

  for (let i=0; i<moreInfo.length; i++){
    const cardItem = document.createElement("li");
    cardItem.setAttribute("class", "cardItem");
    cardItem.innerHTML = decodeURI(moreInfo[i]);
    cardInfo.appendChild(cardItem);
  }

  const confirmButton = document.createElement("button");
  const cancelButton = document.createElement("button");



  confirmButton.innerHTML = "confirm";
  cancelButton.innerHTML = "cancel";
  confirmButton.addEventListener("click", showForm);
  cancelButton.addEventListener("click", clearCard);

  cardContainer.appendChild(cardImg);
  cardContainer.appendChild(cardInfo);
  cardContainer.appendChild(confirmButton);
  cardContainer.appendChild(cancelButton);
}


function showForm() {
  cardImg.remove();
  while (cardInfo.childNodes.length > 1) {
    cardInfo.removeChild(cardInfo.lastChild);
  }
  while(cardContainer.childNodes.length > 1){
    cardContainer.removeChild(cardContainer.lastChild);
  }
  const dateInput = document.createElement("input");
  dateInput.setAttribute("type", "date");
  dateInput.setAttribute("id", "dateInput");
  cardInfo.appendChild(dateInput);

  const reviewInput = document.createElement("textarea");
  reviewInput.setAttribute("id", "reviewInput");
  cardInfo.appendChild(reviewInput);
}

function clearCard() {
  while (cardContainer.firstChild) {
    cardContainer.removeChild(cardContainer.lastChild);
  }
}

function addToDiary() {
 diaryContent.push(currentId);
}
