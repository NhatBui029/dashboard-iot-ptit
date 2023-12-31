
const socket = io();

// $(document).ready(function () {
const sw1 = $(".slider1");

sw1.click(() => {
  console.log('toggleFan');
  socket.emit('control', 'toggleFan');
});

socket.on('statusFan', data => {
  let action;
  if (data === 'on') {
    document.documentElement.style.setProperty('--degree', '360deg');
    action = 'Bật quạt'
  } else {
    document.documentElement.style.setProperty('--degree', '0deg');
    action = 'Tắt quạt'
  }
  fetch('/actions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: action })
  })
    .then(response => response.json())
    .then(datas => {})
    .catch(err => console.error(err));
});


const sw2 = $(".slider2");

sw2.click(() => {
  socket.emit('control', 'toggleLight');
});

socket.on('statusLed', data => {
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

const sw3 = $(".slider3");

sw3.click(() => {
  console.log('toggleAddLed');
  socket.emit('control', 'toggleAddLed');
});

socket.on('statusAddLed', data => {
  console.log("add led");
  let action;
  if (data === 'on') {
    addLed.src = "img/onLight.png";
    action = 'Bật điện 2'
  } else {
    addLed.src = "img/offLight.png";
    action = 'Tắt điện 2'
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

socket.on('canhbao', data => {
  if (data === 'on') {
    // lamp.src = "img/onLight.png";
    // addLed.src = "img/onLight.png";
    document.documentElement.style.setProperty('--canhbao', 'red'); // Sửa thành 'red'
  } else {
    document.documentElement.style.setProperty('--canhbao', 'white'); // Sửa thành 'white'
    // lamp.src = "img/offLight.png";
    // addLed.src = "img/offLight.png";
  }
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


