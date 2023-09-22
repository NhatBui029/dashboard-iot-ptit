const socket = io();

// $(document).ready(function () {
let turnPan = 0;
const sw1 = $(".slider1");

sw1.click(function () {
  if (turnPan == 0) {
    document.documentElement.style.setProperty('--degree', '360deg');
  } else {
    document.documentElement.style.setProperty('--degree', '0deg');
  }
  turnPan = 1 - turnPan;
});


const sw2 = $(".slider2");

sw2.click(() => {
  console.log('toggleLight');
  socket.emit('control', 'toggleLight');
});

socket.on('status', data => {
  let action;
  if (data === 'on') {
    lamp.src = "img/onLight.png";
    action = 'Bật điện'
  } else {
    lamp.src = "img/offLight.png";
    action = 'Tắt điện'
  }
  fetch('/actions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: action })
  })
    .then(response => response.json())
    .then(datas => {
    }
    )
    .catch(err => console.error(err));
});



const circle = document.querySelector(".circle");
let speed = 5000;

let timer = setInterval(function () {
  speed = speed - 5;
  if (speed == 10) {
    speed = 10;
    clearInterval(timer);
  }
  document.documentElement.style.setProperty(`--spinSpeed`, `${speed}ms`);
}, 5);


