const express = require('express')
const app = express()
const port = 3000
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const path = require('path')
const mqtt = require('mqtt')
const db = require('./db/index')
const route = require('./routes/index')
const cookieParser = require('cookie-parser')
const { formatDate } = require('../src/public/util/mongoose')
const dbController = require('../src/app/controllers/DashboardController')
const axios = require('axios');


const socketio = require("socket.io")

app.engine(
  'hbs',
  handlebars.engine({
    extname: '.hbs',
    helpers: {
      formatDate: (date) => formatDate(date),
    }
  }),
);

db.connect();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.use(
  express.urlencoded({
    extended: true,
  }),
  express.json(),
  morgan('dev'),
  cookieParser(),
  express.static(path.join(__dirname, 'public'))
);

route(app);

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const io = socketio(server);
let currentLightStatus = false;
let currentFanStatus = false;

io.on('connection', (socket) => {
  mqttClient.publish('fan', currentFanStatus ? 'on' : 'off');
  mqttClient.publish('led', currentLightStatus ? 'on' : 'off');

  //console.log(`New connection: ${socket.id}`);

  socket.on('control', data => {
    if (data == 'toggleFan') {
      currentFanStatus = !currentFanStatus;
      mqttClient.publish('fan', currentFanStatus ? 'on' : 'off');
      console.log(currentFanStatus);
    } else if (data == 'toggleLight') {
      currentLightStatus = !currentLightStatus;
      mqttClient.publish('led', currentLightStatus ? 'on' : 'off');
    }
  })
})

global.mqttClient = mqtt.connect('mqtt://192.168.115.247');

const topics = ['data', 'ledok', 'fanok'];
mqttClient.on('connect', () => {
  topics.forEach((topic) => {
    mqttClient.subscribe(topic, (err) => {
      if (err) {
        console.error('Sub failed', err);
      } else {
        console.log(`Sub successful with topic : ${topic}`);
      }
    })
  })
});


mqttClient.on('message', (topic, message) => {
  if (topic === 'data') dbController.updateData(topic, message);
  else if (topic === 'ledok') {
    io.emit('statusLed', message.toString());
  } else if (topic === 'fanok') {
    io.emit('statusFan', message.toString());
  }
});

mqttClient.on('close', () => {
  console.log('Đã mất kết nối tới MQTT broker');
});

mqttClient.on('error', (err) => {
  console.error('Lỗi kết nối MQTT:', err);
});


