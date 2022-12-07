
let languages;

let ratingStyles = ["super harsh", "harsh","neutral", "generous", "super generous"];

window.onload = function () {
  getLanguages();
  plotRatingsFreq(justinDiary);
  plotRatingsAll(justinDiary);

}

async function getLanguages() {
  const url = "https://api.themoviedb.org/3/configuration/languages?api_key=f99dcdb2604d84233a9cf4e3f614828a";
  const request = new Request(url);
  const response = await fetch(request);
  languages = await response.json();
}


function plotRatingsFreq(input) {
  let counter = 0;
  for (let i=0.5; i<=5; i+=0.5){
    let bar = document.createElement("div");
    bar.setAttribute("class", "bar");
    const result = input.filter(item => item.rating === i);
    bar.style.width = result.length + "rem";
    bar.innerText = i;
    counter+= result.length*i;
    document.getElementById("ratingsContainer").appendChild(bar);
  };

  let averageRating = counter / input.length;
  let ratingStyle = ratingStyles[Math.round(averageRating/5 * 4)];
  console.log(Math.round(averageRating/5 * 4));


  document.getElementById("ratingsTitle").innerText = "Average rating: " + averageRating.toFixed(2) + " (rating style: " + ratingStyle +")";
}

async function plotRatingsAll(input) {

  let movieObj = {
    myRatings: [],
    userRatings: [],
    movieLanguages: [],
    directors: [],
    counter: 0,
    totalFilms: 0
  }

  for (const item of input){

    const url = "https://api.themoviedb.org/3/movie/" + item.id + "?api_key=f99dcdb2604d84233a9cf4e3f614828a" + "&append_to_response=credits";
    const request = new Request(url);
    const response = await fetch(request);
    const movie = await response.json()
    const director = movie.credits.crew.filter(({job})=> job === "Director")[0];

    movieObj.myRatings.push(item.rating);
    movieObj.userRatings.push(movie.vote_average);
    movieObj.movieLanguages.push(movie.original_language);
    movieObj.directors.push(director);
  }

movieObj.myRatings.sort((a,b) => {
    return a - b ;
  });

movieObj.userRatings.sort((a,b) => {
    return a.rating - b.rating;
  });

  for (let i=0; i<movieObj.myRatings.length; i++){
    let bar = document.createElement("div");
    bar.setAttribute("class", "horizontalBar");
    bar.style.height = movieObj.myRatings[i] + "rem";
    document.getElementById("doubleGraphContainer").appendChild(bar);

    let bar2 = document.createElement("div");
    bar2.setAttribute("class", "horizontalBarBlue");
    bar2.style.height = movieObj.userRatings[i]/2 + "rem";
    bar2.style.left = 1.5+0.5*i + "rem";
    document.getElementById("doubleGraphContainer").appendChild(bar2);
  }

  for (const item of languages){
    let result = movieObj.movieLanguages.filter(entry => entry === item["iso_639_1"]);

    if (result.length > 0) {
      movieObj.counter++;
      console.log(item["english_name"])
      movieObj.totalFilms += result.length;
      let bar = document.createElement("div");
      bar.setAttribute("class", "bar");
      bar.style.width =result.length + "%";
      bar.innerText = item["english_name"] + "(" + result.length + ")";
      document.getElementById("languagesContainer").appendChild(bar);
    }

    let linguaphileScore = Math.round(movieObj.counter/movieObj.totalFilms*100);

    // if (totalFilms < input.length){
    //   let difference = input.length - totalFilms;
    //   let bar = document.createElement("div");
    //   bar.setAttribute("class", "bar");
    //   bar.style.width = difference + "%";
    //   bar.style.background = "grey";
    //   bar.innerText = "other(" + difference +")";
    //   document.getElementById("languagesContainer").appendChild(bar);
    // }
    document.getElementById("languagesTitle").innerText = movieObj.counter + " " + "languages" + " in " + movieObj.totalFilms + " films " + "(linguaphile score:" + linguaphileScore + "%)";
  };

  let directorObj = {}
  let maleCounter = 0;
  let femaleCounter =0;

  for (const item of movieObj.directors){
    directorObj[item.name] ? directorObj[item.name]++ : directorObj[item.name] = 1;
    item.gender == 1 ? femaleCounter ++ : maleCounter ++;

  }


  console.log(movieObj.directors);
  console.log(directorObj)
  console.log("Male directors: " + maleCounter)
  console.log("Female directors: " +femaleCounter)


}
