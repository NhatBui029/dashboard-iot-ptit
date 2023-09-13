const express = require('express');
const route = express.Router();
const DbController = require('../app/controllers/DashboardController');
const authMiddleWare = require('../app/middlerware/middlerware');

route.get('/main',authMiddleWare.auth,DbController.main)
route.post('/signin',DbController.signin)
route.post('/signup',DbController.signup)
route.post('/actions',DbController.actions)
route.get('/logout',DbController.logout)
route.get('/profile',DbController.profile)
route.get('/tableSensorData',DbController.tableSensorData)
route.get('/tableActionHistory',DbController.tableActionHistory)
route.get('/',DbController.index)

module.exports = route;