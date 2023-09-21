const User = require('../models/User');
const Action = require('../models/Action');
const Data = require('../models/Data');
const { mongooseToObject, multipleMongooseToObject } = require('../../public/util/mongoose')

var user;

class DashboardController {
    async index(req, res, next) {
        try {
            await Data.deleteMany({ _id: { $nin: await Data.find().sort({ createdAt: -1 }).limit(20).select('_id').exec() } });
            await Action.deleteMany({ _id: { $nin: await Action.find().sort({ createdAt: -1 }).limit(20).select('_id').exec() } });
            res.render('signin', { layout: 'login' });
        } catch (error) {
            next(error);
        }
    }


    main(req, res, next) {
        user = req.cookies.user;
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
        Promise.all([User.findOne({ user: req.cookies.user }), Data.find({}).sort({ createdAt: -1 }).limit(20)])
            .then(([user, datas]) => {
                res.render('tableSensorData', {
                    layout: 'main',
                    user: mongooseToObject(user),
                    datas: multipleMongooseToObject(datas)
                })
            })
            .catch(next)
    }


    actions(message) {

    }

    actionLed(req, res, next) {
        const { action, mes } = req.body;
        client.publish('led', action);
    }

    actionLedOk(req, res, next) {
        const username = user;
    if (!username) {
        return res.status(400).json({ message: 'Không tìm thấy cookies' });
    }
    const action = new Action({
        sensorId: 'packetId' + Math.floor(Math.random() * 1000),
        name: username,
        action: req.body.message === 'on' ? 'Bật điện' : 'Tắt điện'
    });

    action.save()
        .then(() => {
            next();
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Lỗi lưu action vào cơ sở dữ liệu' });
        });
        
    }

    tableActionHistory(req, res, next) {
        Promise.all([User.findOne({ user: req.cookies.user }), Action.find({}).sort({ createdAt: -1 }).limit(20)])
            .then(([user, actions]) => {
                
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

    updateData(topic, message) {
        console.log(`Nhận được dữ liệu từ chủ đề ${topic}: ${message.toString()}`);
        const json = JSON.parse(message);
        const data = new Data({
            sensorId: 'packetId' + Math.floor(Math.random() * 100001),
            temperature: json.temp,
            humidity: json.hum,
            light: json.light
        })
        data.save();
    }


    async getData(req, res, next) {
        try {
            const datas = await Data.find({}).sort({ createdAt: -1 }).limit(20);
            datas.reverse();
            const arr = datas.map(data => data.toObject());
            res.status(200).json(arr);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}

module.exports = new DashboardController();