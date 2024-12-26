const searchList = document.getElementById("searchList");
const searchBar = document.getElementById("searchBar");
const searchContainer = document.getElementById("searchContainer");
const cardContainer = document.getElementById("cardContainer");
const filmSubmitForm = document.getElementById("filmSubmitForm");
const dateInput = document.getElementById("dateInput");
const reviewInput = document.getElementById("reviewInput");
const ratingInput = document.getElementById("ratingInput")
const stars = document.getElementsByClassName("stars");
const starLabels = document.getElementsByClassName("starLabel");
const formTitle = document.getElementById("formTitle");
const cancelForm = document.getElementById("cancelForm");
const diaryItemContainer = document.getElementById("diaryItemContainer");
const sortOptions = document.getElementById("sortOptions");
const addToDiary = document.getElementById("addToDiary");
const addFilm = document.getElementById("addFilm");
const mainContainer = document.getElementById("mainContainer");

filmSubmitForm.addEventListener("submit", submitForm);
cancelForm.addEventListener("click", hideForm);

searchBar.addEventListener("input", clearSearch);
searchBar.addEventListener("input", populate);

addToDiary.addEventListener("click", submitForm);

addFilm.addEventListener("click", toggleSearch);

let currentId = "";
let currentTitle = "";
let mainContainerVisibility = false;


let diaryContent = justinDiary;

function toggleSearch() {


  switch(mainContainerVisibility) {
    case false:
      mainContainer.style.display = "block";
      mainContainerVisibility = true;
    break;
    case true:
      mainContainer.style.display = "none";
      mainContainerVisibility = false;
    break;
  }
}

function clearSearch() {
  while (searchList.hasChildNodes()) {
    searchList.removeChild(searchList.firstChild);
  }
}

async function populate() {
  if (searchBar.value === "") {
    return;
  } else {
    const firstPartURL = "https://api.themoviedb.org/3/search/movie?api_key=f99dcdb2604d84233a9cf4e3f614828a&language=en-UK&query=";
    let query = searchBar.value;

    const requestURL = firstPartURL + encodeURI(query);
    const request = new Request(requestURL);
    const response = await fetch(request);
    const movies = await response.json();

    for (let i = 0; i < 10; i++) {

      const title = movies.results[i].title;
      const date = movies.results[i].release_date.slice(0, 4);
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
      searchItemMoreInfo.setAttribute("class", "searchItemMoreInfo");
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
  searchContainer.style.display = "none";
  while (cardContainer.firstChild) {
    cardContainer.removeChild(cardContainer.lastChild);
  }

  const url = "https://api.themoviedb.org/3/movie/" + this.value + "?api_key=f99dcdb2604d84233a9cf4e3f614828a";
  const request = new Request(url);
  const response = await fetch(request);
  const movie = await response.json();

  currentId = movie.id;
  currentTitle = movie.title;

  let moreInfo = [];

  moreInfo.push(movie.title);
  if (movie.original_language !== "en" && movie.original_title !== movie.title) moreInfo.push(movie.original_title);
  moreInfo.push(movie.release_date.slice(0, 4));
  if (movie.spoken_languages.length >= 1) moreInfo.push(movie.spoken_languages[0].english_name);
  moreInfo.push(movie.overview);

  const cardImg = document.createElement("img");
  cardImg.src = "https://image.tmdb.org/t/p/w780" + movie.backdrop_path;
  cardImg.setAttribute("class", "cardImg");

  const cardInfo = document.createElement("ul");
  cardInfo.setAttribute("class", "cardInfo");

  for (let i = 0; i < moreInfo.length; i++) {
    const cardItem = document.createElement("li");
    cardItem.setAttribute("class", "cardItem");
    cardItem.innerHTML = moreInfo[i];
    cardInfo.appendChild(cardItem);
  }

  const confirmButton = document.createElement("button");
  const cancelButton = document.createElement("button");

  confirmButton.innerText = "confirm";
  cancelButton.innerText = "back";
  confirmButton.addEventListener("click", showForm);
  cancelButton.addEventListener("click", clearAll);

  cardContainer.appendChild(cardImg);
  cardContainer.appendChild(cardInfo);
  cardContainer.appendChild(confirmButton);
  cardContainer.appendChild(cancelButton);
}

function showForm() {
  cardContainer.style.display = "none";
  formContainer.style.display = "flex";
  formTitle.innerText = currentTitle;
  dateInput.valueAsDate = new Date();
}

function hideForm() {

  filmSubmitForm.reset();
  cardContainer.style.display = "inline";
  formContainer.style.display = "none";
}

function resetSearch() {
  searchBar.value = "";
  clearSearch();
}

function clearAll() {
  while (cardContainer.firstChild) {
    cardContainer.removeChild(cardContainer.lastChild);
  }
  searchContainer.style.display = "block";
  ratingInput.value = 0;
  document.getElementById("ratingYellowBg").style.width = 0;
}

function submitForm() {

  diaryContent.push({
    "id": currentId,
    "date": dateInput.value,
    "review": reviewInput.value,
    "rating": Number(ratingInput.value),
    "title": currentTitle
  });
  clearAll();
  hideForm();
  updateDiary();
  resetSearch();
  toggleSearch();
}

async function updateDiary() {

  while (diaryList.firstChild) {
    diaryList.removeChild(diaryList.lastChild);
  }

  sortDiary();

  for (const entry of diaryContent){
    const url = "https://api.themoviedb.org/3/movie/" + entry.id + "?api_key=f99dcdb2604d84233a9cf4e3f614828a";
    const request = new Request(url);
    const response = await fetch(request);
    const movie = await response.json();

    const date = movie.release_date.slice(0, 4);
    const originalLanguage = (movie.original_language === "en" || movie.title === movie.original_title) ? "" : movie.original_title + ", ";
    const viewedDate = new Date(entry.date).toString().slice(3, 15);
    const diaryItem = document.createElement("li");

    diaryItem.setAttribute("class", "diaryItem");
    diaryItem.setAttribute("id", entry.id);
    diaryItem.setAttribute("onclick", "showDiaryItem(this)")

    const dateAndOrder = document.createElement("div");
    dateAndOrder.setAttribute("class", "dateAndOrder");

    const viewOrder = document.createElement("p");
    viewOrder.setAttribute("class", "viewOrder");

    switch(sortOptions.options[sortOptions.selectedIndex].value){
      case "dateNewest": viewOrder.innerHTML = diaryContent.length - diaryContent.indexOf(entry);
      break;
      case "dateOldest":  viewOrder.innerHTML = diaryContent.indexOf(entry) +1;
      break;
      case "ratingLowest":
        if (diaryContent.indexOf(entry) === 0){
          viewOrder.innerHTML = (Number.isInteger(entry.rating)) ? entry.rating + "★" : "";
        }
        else if (Math.floor(entry.rating) > Math.floor(diaryContent[diaryContent.indexOf(entry)-1].rating)){
          viewOrder.innerHTML = entry.rating + "★";
        }
        else {
          viewOrder.innerHTML = "";
        }
        break;
      case "ratingHighest":
        if (diaryContent.indexOf(entry) === 0){
          viewOrder.innerHTML = (Number.isInteger(entry.rating)) ? entry.rating + "★" : "";
        }
        else if (Math.ceil(diaryContent[diaryContent.indexOf(entry)-1].rating) > Math.ceil(entry.rating)){
          viewOrder.innerHTML = entry.rating + "★";
        }
        else {
          viewOrder.innerHTML = "";
        }
      break;
      case "az":
      case "za":
        if (diaryContent.indexOf(entry) === 0 || diaryContent[diaryContent.indexOf(entry)-1].title.slice(0,1) !== entry.title.slice(0,1)){
          viewOrder.innerHTML = entry.title.slice(0,1)
        }
        else {
          viewOrder.innerHTML = "";
        }
      }

    dateAndOrder.appendChild(viewOrder);

    const diaryItemImg = document.createElement("img");
    diaryItemImg.src = "https://image.tmdb.org/t/p/w92/" + movie.poster_path;
    diaryItemImg.setAttribute("class", "posterThumbnail");

    const textContainer = document.createElement("div")

    const diaryItemTitle = document.createElement("p");
    diaryItemTitle.setAttribute("class", "diaryItemTitle");
    diaryItemTitle.innerHTML = movie.title

    const diaryItemMoreInfo = document.createElement("p");
    diaryItemMoreInfo.setAttribute("class", "diaryItemMoreInfo");
    diaryItemMoreInfo.innerHTML = originalLanguage + " " + date + "<br>" + "<span style=\"color: #3abfcf\">" + printRating(entry) + "</span> <br>" + "viewed on " + viewedDate;

    const removeButton = document.createElement("button");
    removeButton.innerText = "×";
    removeButton.setAttribute("class", "removeButton")        
    removeButton.addEventListener("click", function () {
      diaryContent = diaryContent.filter(item => item.id != entry.id);
      document.getElementById(entry.id).remove();
      event.stopPropagation();
      updateDiary();
    });
    textContainer.appendChild(diaryItemTitle);
    textContainer.appendChild(diaryItemMoreInfo);

    diaryItem.appendChild(dateAndOrder);
    diaryItem.appendChild(diaryItemImg);
    diaryItem.appendChild(textContainer);
    diaryItem.appendChild(removeButton);

    diaryList.appendChild(diaryItem);

    currentId = "";
    currentTitle = "";
  }
}

function printRating(input) {
  let rating = "";
  let floorRating = Math.floor(input.rating);

  for (let i=0; i<floorRating; i++){
    rating +="★";
  }
  if (!Number.isInteger(input.rating)){
    rating += "½";
  }
  return rating
}

async function showDiaryItem(input) {
  diaryList.style.display = "none";
  sortContainer.style.display = "none"

  const entry = stintent.find(element => element.id == input.id);

  const url = "https://api.themoviedb.org/3/movie/" + input.id + "?api_key=f99dcdb2604d84233a9cf4e3f614828a";
  const request = new Request(url);
  const response = await fetch(request);
  const movie = await response.json();

  let moreInfo = [];

  moreInfo.push(movie.title);
  if (movie.original_language !== "en" && movie.title !== movie.original_title) moreInfo.push(movie.original_title);
  moreInfo.push(movie.release_date.slice(0, 4));
  if (movie.spoken_languages.length >= 1) moreInfo.push(movie.spoken_languages[0].english_name);
  moreInfo.push(printRating(entry));
  (entry.review.length === 0) ? moreInfo.push("no review yet") : moreInfo.push(entry.review);

  const diaryImg = document.createElement("img");
  diaryImg.src = "https://image.tmdb.org/t/p/w780" + movie.backdrop_path;
  diaryImg.setAttribute("class", "cardImg");

  const diaryInfo = document.createElement("ul");
  diaryInfo.setAttribute("class", "cardInfo");

  for (let i = 0; i < moreInfo.length; i++) {
    const diaryItem = document.createElement("li");
    diaryItem.setAttribute("class", "cardItem");
    diaryItem.innerHTML = moreInfo[i];
    diaryInfo.appendChild(diaryItem);
  }

  const backButton = document.createElement("button");

  backButton.innerText = "back";
  backButton.addEventListener("click", clearDiaryItemContainer);

  diaryItemContainer.appendChild(diaryImg);
  diaryItemContainer.appendChild(diaryInfo);
  diaryItemContainer.appendChild(backButton);
}

function clearDiaryItemContainer() {
  while (diaryItemContainer.firstChild) {
    diaryItemContainer.removeChild(diaryItemContainer.lastChild);
  }
  diaryList.style.display = "block";
  sortContainer.style.display = "block";
}

window.onload = function () {
    updateDiary();
}

function rate(input) {
  document.getElementById("ratingYellowBg").style.width = input.value*1.71 + "rem";
  validateForm();
}

function validateForm(){
    addToDiary.disabled = (ratingInput.value <= 0 || !dateInput.value) ? true : false;
}

function sortDiary() {

let selection = sortOptions.options[sortOptions.selectedIndex].value;

  switch(selection){
    case "dateNewest":
      diaryContent.sort((a,b) => {
        return new Date(b.date) - new Date(a.date);
      });
    break;
    case "dateOldest":
      diaryContent.sort((a,b) => {
        return new Date(a.date) - new Date(b.date);
      });
    break;
    case "ratingHighest":
      diaryContent.sort((a,b) => {
        return b.rating - a.rating;
      });
    break;
    case "ratingLowest":
      diaryContent.sort((a,b) => {
        return a.rating - b.rating;
      });
    break;
    case "az":
      diaryContent.sort((a,b) => {
        if (a.title < b.title) {return -1;}
        if (a.title > b.title) {return 1;}
        return 0;
      });
    break;
    case "za":
      diaryContent.sort((a,b) => {
        if (a.title < b.title) {return 1;}
        if (a.title > b.title) {return -1;}
        return 0;
      });
  }
}

// async function languages(input) {
//
//   let array = [];
//
//   for (const item of diaryContent){
//     const url = "https://api.themoviedb.org/3/movie/" + item.id + "?api_key=f99dcdb2604d84233a9cf4e3f614828a";
//     const request = new Request(url);
//     const response = await fetch(request);
//     const movie = await response.json();
//
//     array.push(movie.original_language);
//   }
//   return array;
// }
