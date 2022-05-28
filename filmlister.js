

const searchList = document.getElementById("searchList");
const searchBar = document.getElementById("searchBar");
const cardContainer = document.getElementById("cardContainer");

searchBar.addEventListener("input", clearSearch);
searchBar.addEventListener("input", populate);

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


      const searchItem = document.createElement("li");

      searchItem.setAttribute("class", "searchItem");

      const searchItemTitle = document.createElement("p");
      searchItemTitle.setAttribute("class", "searchItemTitle");
      searchItemTitle.innerHTML = title

      const searchItemMoreInfo = document.createElement("p");
      searchItemMoreInfo.setAttribute ("class", "searchItemMoreInfo");
      searchItemMoreInfo.innerHTML = originalLanguage + " " + date;

      searchItem.appendChild(searchItemTitle);
      searchItem.appendChild(searchItemMoreInfo);
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

  const moreInfo = [];

  moreInfo.push(movie.title);
  moreInfo.push(movie.release_date.slice(0,4));
  moreInfo.push(movie.original_language);
  moreInfo.push(movie.overview);
  moreInfo.push(movie.poster_path);

  const cardInfo = document.createElement("ul");
  cardInfo.setAttribute("class", "cardInfo");

  for (let i=0; i<moreInfo.length-1; i++){
    const cardItem = document.createElement("li");
    cardItem.setAttribute("class", "cardItem");
    cardItem.innerHTML = moreInfo[i];
    cardInfo.appendChild(cardItem);
  }

  cardContainer.appendChild(cardInfo);

}
