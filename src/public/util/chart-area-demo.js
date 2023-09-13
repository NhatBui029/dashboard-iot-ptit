// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

var arr = [];
arr.push(40);
for (let i = 0; i < 19; i++) {
  arr.unshift(arr[0] + Math.floor(Math.random() * 21) - 10);
}
var dem = 0;

function randomdata() {
  if (dem == 0) {
    dem = dem + 1;
    return arr;
  }
  else {
    let m = arr[0];
    for (let i = 1; i < 20; i++) {
      let n = arr[i];
      arr[i] = m;
      m = n;
    }
    arr[0] = arr[0] + Math.floor(Math.random() * 11) - 5;
    if(arr[0] < 0) arr[0] = -arr[0];
    if(arr[0] > 100) arr[0] = arr[0] - 100;
    document.getElementById('temp').textContent= arr[0]+'%';
    return arr;
  }
}


var arr1 = [];
arr1.push(30);
for (let i = 0; i < 19; i++) {
  arr1.unshift(arr1[0] + Math.floor(Math.random() * 21) - 10);
}
var dem1 = 0;

function randomdata1() {
  if (dem1 == 0) {
    dem1 = dem1 + 1;
    return arr1;
  }
  else {
    let m = arr1[0];
    for (let i = 1; i < 20; i++) {
      let n = arr1[i];
      arr1[i] = m;
      m = n;
    }
    arr1[0] = arr1[0] + Math.floor(Math.random() * 21) - 10;
    if(arr1[0] < 0) arr1[0] = -arr1[0];
    if(arr1[0] > 100) arr1[0] = arr1[0] - 100;
    document.getElementById('hum').textContent= arr1[0]+'%';
    return arr1;
  }
}

var arr2 = [];
arr2.push(500);
for (let i = 0; i < 19; i++) {
  arr2.unshift(arr2[0] + Math.floor(Math.random() * 200) - 100);
}
var dem2 = 0;

function randomdata2() {
  if (dem2 == 0) {
    dem2 = dem2 + 1;
    return arr2;
  }
  else {
    let m = arr2[19];
    for (let i = 18; i >=0; i--) {
      let n = arr2[i];
      arr2[i] = m;
      m = n;
    }
    arr2[19] = arr2[19] + Math.floor(Math.random() * 200) - 100;
    if(arr2[19] < 19) arr2[19] = -arr2[19];
    if(arr2[19] > 1000) arr2[19] = arr2[19] - 1000;
    document.getElementById('light').textContent= arr2[19]+'Lux';
    return arr2;
  }
}

function createLabels() {
  let arr = [];
  for (let i = 0; i < 20; i++) {
    arr.push(i.toString());
  }
  return arr;
}

var loop = setInterval(() => {
  var ctx = document.getElementById("myAreaChart");
  var myLineChart = new Chart(ctx, { 
    type: 'line',
    data: {
      labels: createLabels(),
      datasets: [
        {
          label: "Temperature",
          lineTension: 0.3,
          backgroundColor: "rgba(0,0,0,0.01",
          borderColor: "rgba(78, 115, 223, 1)",
          borderWidth: 2,
          pointRadius: 0,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: randomdata(),
          yAsixID: 'yLeft'
        },
        {
          label: "Humdity",
          lineTension: 0.3,
          backgroundColor: "rgba(0,0,0,0.01",
          borderColor: "green",
          pointRadius: 0,
          borderWidth: 2,
          pointBackgroundColor: "green",
          pointBorderColor: "green",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "green",
          pointHoverBorderColor: "green",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: randomdata1(),
          yAxisID: 'left',
        },
        {
          label: "Light",
          lineTension: 0.3,
          backgroundColor: "rgba(0,0,0,0.01",
          borderColor: "black",
          pointRadius: 0,
          borderWidth: 2,
          pointBackgroundColor: "black",
          pointBorderColor: "black",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "black",
          pointHoverBorderColor: "black",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: randomdata2(),
          yAxisID: 'right',
        }
      ],
    },
    options: {
      maintainAspectRatio: false,
      animation: {
        duration: 0 // Đặt duration (thời gian) là 0 để tắt transition
      },
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'date'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 7
          }
        }],
        yAxes: [{
          id: 'left',
          position: 'left',
          ticks: {
            maxTicksLimit: 10, // số lượng đưởng kẻ ngang ( chia tỉ lệ)
            padding: 10,
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return  number_format(value) ;
            }
          },
          gridLines: { // đường kẻ ngang 
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [3],
            zeroLineBorderDash: [3]
          }
        },{
          id: 'right',
          position: 'right',
          ticks: {
            maxTicksLimit: 5, // số lượng đưởng kẻ ngang ( chia tỉ lệ)
            padding: 10,
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return  number_format(value);
            }
          },
          gridLines: { // đường kẻ ngang 
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [3],
            zeroLineBorderDash: [3]
          }
        }],
      },
      legend: { //chủ thích
        display: true
      },
      tooltips: { //chi tiết dữ liệu trên line
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: 'index',
        caretPadding: 10,
        callbacks: {
          label: function (tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
          }
        }
      }
    }
  });
  document.documentElement.style.setProperty('--widthTemp', arr[0] + '%');
  document.documentElement.style.setProperty('--widthHum', arr1[0] + '%');
  document.documentElement.style.setProperty('--widthLight', arr2[19]/12 + '%');
}, 1500)
// Area Chart Example


// const testChart = document.getElementById("test");
// console.log(testChart)
// let canvas = new Chart(testChart,{
//   type: 'line',
//   data: {
//     labels: ['one', 'two', 'three', 'four', 'five', 'six'],
//     datasets:[
//       {
//         label: "test 1",
//         lineTension: 0.4 ,
//         backgroundColor: 'rgba(78, 115, 223, 0.05',
//         borderColor: 'red',
//         pointBackgroundColor: 'red',
//         pointBorderColor: 'red',
//         data: [4,3,5,6,4,3]
//       }
//     ]
//   }
// })