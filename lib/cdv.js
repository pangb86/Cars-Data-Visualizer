import Chart from 'chart.js';

function carData() {
  const base_url = "https://www.carqueryapi.com/api/0.3/";

  $.getJSON(base_url+"?callback=?", {cmd:"getTrims", min_power:500, min_year: 2013 }, (data) => {

    console.log(data);
    //The 'data' variable contains all response data.
    // var makes = data.Makes;
    // for (var i = 0; i < makes.length; i++)
    // {
    //   //You can now do what you like with the response data
    //   alert(makes[i].make_display);
    // }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  var ctx = document.getElementById("myChart").getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });
});

carData();
