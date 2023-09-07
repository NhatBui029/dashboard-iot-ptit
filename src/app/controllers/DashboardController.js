const User = require('../models/User');
const { mongooseToObject } = require('../../public/util/mongoose')

class DashboardController {
    index(req, res, next) {
        res.render('signin', { layout: 'login' })
    }

    main(req, res, next) {
        User.findOne({ user: req.cookies.user })
            .then(user => {
                res.render('home', {
                    layout: 'main',
                    user: mongooseToObject(user),
                });
            })
            .catch(next)
    }

    logout(req, res, next) {
        res.clearCookie('user');
        res.redirect('/');
    }

    tableSensorData(req, res, next) {
        res.render('tableSensorData',{
            layout: 'main',
        })
    }

    tableActionHistory(req, res, next) {
        res.render('tableActionHistory',{
            layout: 'main',
        })
    }

    signin(req, res, next) {
        User.findOne({ user: req.body.user })
            .then(user => {
                if (user) {
                    if (user.password === req.body.password) {
                        res.cookie('user', req.body.user, { maxAge: 90000000, httpOnly: true });
                        res.redirect('/main');
                    } else {
                        res.render('signin', {
                            layout: 'login',
                            error: "Mật khẩu không chính xác !!"
                        })
                    }
                } else {
                    res.render('signin', {
                        layout: 'login',
                        error: "Tài khoản không tồn tại !!"
                    })
                }
            })
            .catch(next)
    }

    signup(req, res, next) {
        User.findOne({ user: req.body.user })
            .then(user => {
                if (user) {
                    res.render('signin', {
                        layout: 'login',
                        error1: 'Tài khoản đã tồn tại !!'
                    })
                } else {
                    const userr = new User({
                        user: req.body.user,
                        sdt: req.body.phone,
                        password: req.body.password,
                        ten: req.body.name,
                        masv: req.body.code,
                    })
                    userr.save()
                        .then(() => {
                            res.cookie('user', req.body.user, { maxAge: 90000000, httpOnly: true });
                            res.redirect('/main');
                        })
                        .catch(next)
                }
            })
            .catch(next)
    }
}

module.exports = new DashboardController();