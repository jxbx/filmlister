

const searchList = document.getElementById("searchList");
const searchBar = document.getElementById("searchBar");

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
    console.log(movies);



    for (let i=0; i<movies.results.length; i++){

      const title = movies.results[i].title;
      const date = movies.results[i].release_date.slice(0,4);
      const originalLanguage = (movies.results[i].original_language === "en") ? "" : movies.results[i].original_title + ", ";


      const searchItem = document.createElement("option");
      searchItem.class = "searchItem";
      searchItem.value = title;
      searchItem.label = originalLanguage + date;
      searchItem.dataset.filmId = movies.results[i].id;
      searchList.appendChild(searchItem);
    }
  }
}

function showCard(value) {
  console.log(value);

}
