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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

global.client = mqtt.connect('mqtt://192.168.161.247');

const topic = 'data';
client.on('connect', () => {
  client.subscribe(topic, (err) => {
    if (err) {
      console.error('Sub failed', err);
    } else {
      console.log('Sub successful');
    }  
  })
});

client.on('message', (topic, message) => {
  dbController.updateData(topic,message);
});

client.on('close', () => {
  console.log('Đã mất kết nối tới MQTT broker');
});

client.on('error', (err) => {
  console.error('Lỗi kết nối MQTT:', err);
});

module.exports = {
  getClient: () => client, 
};
