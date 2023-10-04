const express = require('express');
const route = express.Router();
const DbController = require('../app/controllers/DashboardController');
const Middleware = require('../app/middlerware/middlerware');
const middlerware = require('../app/middlerware/middlerware');

route.get('/main',Middleware.auth,DbController.main)
route.post('/signin',DbController.signin)
route.post('/signup',DbController.signup)
route.post('/actions',DbController.actions)
route.post('/search/tableSensorData',middlerware.sortMiddleware,DbController.search)
route.post('/filter/tableActionHistory',middlerware.sortMiddleware,DbController.filter)
route.get('/logout',DbController.logout)
route.get('/profile',DbController.profile)
route.get('/getData',DbController.getData)
route.get('/tableSensorData',middlerware.sortMiddleware,DbController.tableSensorData)
route.get('/tableActionHistory',middlerware.sortMiddleware,DbController.tableActionHistory)
route.get('/',DbController.index)

module.exports = route;