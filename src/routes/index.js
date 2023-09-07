const DashboardRoute = require('./dashboard');

function route(app){
    app.use('/',DashboardRoute);
}

module.exports = route;