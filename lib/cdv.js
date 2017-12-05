import Chart from 'chart.js';

var colors = [];

var COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];


function makeChart(carMakes, count) {
  var carColors = COLOR_NAMES.slice(0, carMakes.length);
  var ctx = document.getElementById("chart").getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
          labels: carMakes,
          datasets: [{
              label: '# of Models over 500HP',
              data: count,
              backgroundColor: carColors
          }]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "Manufactures of Cars Over 500HP"
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
      }
  });
}

function carData() {
  const baseUrl = "https://www.carqueryapi.com/api/0.3/";

  $.getJSON(baseUrl+"?callback=?", {cmd:"getTrims", min_power:500, min_top_speed: 100 }, (data) => {
    const carList = data.Trims;
    console.log(carList);
    let carMakeModelArr = [];
    let carMakeArr = [];
    let powerArr = [];
    let topSpeedArr = [];
    let carMakeHash={};

    for (var i = 0; i < carList.length; i++) {
      let currentCar = carList[i];
      let carMake = currentCar.make_display;
      let carModel = currentCar.model_name;
      let carTrim = currentCar.model_trim;
      let fullName = `${carMake} ${carModel} ${carTrim}`;
      carMakeModelArr.push(fullName);
      carMakeArr.push(carMake);
      powerArr.push(currentCar.model_engine_power_ps);

      if (carMakeHash[carMake] === undefined) {
        carMakeHash[carMake] = 1;
      } else {
        carMakeHash[carMake] += 1;
      }
    }

    console.log(carMakeHash);

    let makes = Object.keys(carMakeHash);
    let makesCount = Object.values(carMakeHash);
    console.log(makes);
    console.log(makesCount);
    console.log(makesCount.length);
    let carColors = COLOR_NAMES.slice(0, makes.length);
    console.log(carColors.length);
    makeChart(makes, makesCount);
  });
}

carData();
// makeChart();
