const express = require('express')
const app = express()
const port = 3000
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const path = require('path')
const db = require('./db/index')
const route = require('./routes/index')
const cookieParser = require('cookie-parser')
const {formatDate} = require('../src/public/util/mongoose')

app.engine(
  'hbs', 
  handlebars.engine({
    extname: '.hbs',
    helpers: {
      formatDate : (date) => formatDate(date),
    }
  }),
);

db.connect();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources','views'));

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