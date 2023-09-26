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

const createLabels = () => {
  let arr = [];
  for (let i = 0; i < 20; i++) {
    arr.push(i.toString());
  }
  return arr;
}
var arr;

const fetchData = () => {
  fetch('/getData', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(datas => {
      arr = [...datas]
    }
    )
    .catch(err => console.error(err));
};

const getTemp = ()=>{
  let temp = [];
  arr.forEach(data=>{
    temp.push(data.temperature)
  })
  document.getElementById('temp').textContent = temp[19] + '°C';
  document.documentElement.style.setProperty('--widthTemp', temp[19] + '%');
  temp.reverse();
  return temp;
}

const getHum = ()=>{
  let hum = [];
  arr.forEach(data=>{
    hum.push(data.humidity)
  })
  document.getElementById('hum').textContent = hum[19] + '%';
  document.documentElement.style.setProperty('--widthHum', hum[19] + '%');
  hum.reverse();
  return hum;
}
const getLight = ()=>{
  let light = [];
  arr.forEach(data=>{
    light.push(data.light)
  })
  document.getElementById('light').textContent = light[19] + 'Lux';
  document.documentElement.style.setProperty('--widthLight', light[19]/12 + '%');
  return light;
}
const getGas = ()=>{
  let gas = [];
  arr.forEach(data=>{
    gas.push(parseInt(data.gas/10))
  })
  document.getElementById('gas').textContent = gas[19] + '%LEL';
  document.documentElement.style.setProperty('--widthGas', gas[19] + '%');
  gas.reverse();
  return gas;
}

var loop = setInterval(() => {
  fetchData();
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
          data: getTemp(),
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
          data: getHum(),
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
          data: getLight(),
          yAxisID: 'right',
        }
        // ,
        // {
        //   label: "Gas",
        //   lineTension: 0.3,
        //   backgroundColor: "rgba(0,0,0,0.01",
        //   borderColor: "#6f42c1",
        //   pointRadius: 0,
        //   borderWidth: 2,
        //   pointBackgroundColor: "#6f42c1",
        //   pointBorderColor: "#6f42c1",
        //   pointHoverRadius: 3,
        //   pointHoverBackgroundColor: "#6f42c1",
        //   pointHoverBorderColor: "#6f42c1",
        //   pointHitRadius: 10,
        //   pointBorderWidth: 2,
        //   data: getGas(),
        //   yAxisID: 'left',
        // }
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
            maxTicksLimit: 10
          }
        }],
        yAxes: [{
          id: 'left',
          position: 'left',
          ticks: {
            maxTicksLimit: 5, // số lượng đưởng kẻ ngang ( chia tỉ lệ)
            padding: 10,
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return number_format(value);
            }
          },
          gridLines: { // đường kẻ ngang 
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [3],
            zeroLineBorderDash: [3]
          }
        }, {
          id: 'right',
          position: 'right',
          ticks: {
            maxTicksLimit: 5, // số lượng đưởng kẻ ngang ( chia tỉ lệ)
            padding: 10,
            callback: function (value, index, values) {
              return number_format(value);
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
            return datasetLabel + ' : ' + number_format(tooltipItem.yLabel);
          }
        }
      }
    }
  });
}, 3000);