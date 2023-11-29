
 let ratings = {
  ratingFrequencies: [],
  dateFrequencies: []
 };

function getRatings(input){

    let ratingsCounter = 0;
    for (let i=0.5; i<=5; i+=0.5){
      let result = input.filter(item => item.rating === i).length;
      ratings.ratingFrequencies.push(result);
      ratingsCounter += result*i;
    }
    for (let i=1; i<=12; i++){
      ratings.dateFrequencies.push(input.filter(item => parseInt(item.date.slice(5,7)) === i).length);
    }
    ratings.averageRating = ratingsCounter / justinDiary.length;
}

getRatings(justinDiary)






const myRatings = document.getElementById('myRatings');
      
new Chart(myRatings, {
  data: {
    datasets: [{
        type: 'bar',
        label: 'Bar Dataset',
        data: ratings.ratingFrequencies,
    }, {
        type: 'line',
        label: 'Line Dataset',
        data: ratings.ratingFrequencies,
        cubicInterpolationMode: "monotone",
    }],
    labels: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
},
options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  // type: 'bar',
  // options: {
  //   legend: {
  //     display: false
  //   }
  // },
  // data: {
  //   labels: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
  //   datasets: [{
  //     label: "Average rating: " + ratings.averageRating.toFixed(2) ,
  //     data: ratings.ratingFrequencies,
  //     borderWidth: 1
  //   }]
  // },
  // options: {
  //   scales: {
  //     y: {
  //       beginAtZero: true
  //     }
  //   }
  // }
});

const myDates = document.getElementById('myDates');
      
new Chart(myDates, {
  // type: 'bar',
  // options: {
  //   legend: {
  //     display: false
  //   }
  // },
  // data: {
  //   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  //   datasets: [{
  //     label: "Date watched distribution",
  //     data: ratings.dateFrequencies,
  //     borderWidth: 1
  //   }]
  // },
  // 
  data: {
    datasets: [{
        type: 'bar',
        label: 'Bar Dataset',
        data: ratings.dateFrequencies,
    }, {
        type: 'line',
        label: 'Line Dataset',
        data: ratings.dateFrequencies,
    }],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
},
options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

const allRatings = document.getElementById('allRatings');

new Chart(allRatings, {
  type: 'bar',
  options: {
    legend: {
      display: false
    }
  },
  data: {
    datasets: [{
      label: "Date watched distribution",
      data: justinDiary,
      borderWidth: 1
    }]
  },
  options: {
    parsing: {
      xAxisKey: 'title',
      yAxisKey: 'rating'
    },
    scales: {
      y: {
        beginAtZero: true
      },
      x: {
        ticks: {
          display: false
        }
      }
    }
  }
});



