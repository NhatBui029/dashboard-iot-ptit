const User = require('../models/User');
const Action = require('../models/Action');
const { mongooseToObject, multipleMongooseToObject } = require('../../public/util/mongoose')

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

    profile(req, res, next) {
        User.findOne({ user: req.cookies.user })
        .then(user => {
            res.render('profile', {
                layout: 'main',
                user: mongooseToObject(user),
            });
        })
        .catch(next)
    }

    tableSensorData(req, res, next) {
        res.render('tableSensorData', {
            layout: 'main',
        })
    }

    actions(req, res, next) {
        const action = new Action({
            sensorId: "test1",
            name: req.cookies.user,
            action: req.body.action
        })
        action.save()
            .then(() => {
                res.redirect('back')
            })
            .catch(next)
    }

    tableActionHistory(req, res, next) {
        Promise.all([User.findOne({ user: req.cookies.user }), Action.find({})])
            .then(([user, actions]) => {
                actions.reverse();
                res.render('tableActionHistory', {
                    layout: 'main',
                    actions: multipleMongooseToObject(actions),
                    user: mongooseToObject(user)
                })
            })
            .catch(next)
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