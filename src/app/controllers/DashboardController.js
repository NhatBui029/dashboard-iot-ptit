const User = require('../models/User');
const Action = require('../models/Action');
const Data = require('../models/Data');
const { mongooseToObject, multipleMongooseToObject } = require('../../public/util/mongoose')
const util = require('../../public/util/mongoose')

const PAGE_MAX = 10;

const sortCriteria = [
    { column: 'createdAt', order: 'desc' },
    { column: 'sensorId', order: 'desc' },
    { column: 'temperature', order: 'desc' },
    { column: 'humidity', order: 'desc' },
    { column: 'light', order: 'desc' },
];


class DashboardController {
    async index(req, res, next) {
        try {
            // await Data.deleteMany({ _id: { $nin: await Data.find().sort({ createdAt: -1 }).limit(20).select('_id').exec() } });
            //  await Action.deleteMany({ _id: { $nin: await Action.find().sort({ createdAt: -1 }).limit(20).select('_id').exec() } });
            res.render('signin', { layout: 'login' });
        } catch (error) {
            next(error);
        }
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

    static updateSortCriteria(column, order) {
        const index = sortCriteria.findIndex(criteria => criteria.column === column);
        sortCriteria[index].order = order;
        const removedElement = sortCriteria.splice(index, 1)[0];
        sortCriteria.unshift(removedElement);
        console.log(sortCriteria);
    }

    tableSensorData(req, res, next) {
        // res.json(res.locals._sort);

        const page = parseInt(req.query.page);
        const column = req.query.column;
        const order = req.query.order;

        if (column && order) DashboardController.updateSortCriteria(column, order);

        const sortObject = sortCriteria.reduce((acc, curr) => {
            acc[curr.column] = curr.order === 'asc' ? 1 : -1;
            return acc;
        }, {});


        Promise.all([
            User.findOne({ user: req.cookies.user }),
            Data.find({}).sort(sortObject).skip(PAGE_MAX * (page - 1)).limit(20),
            Data.countDocuments()
        ])
            .then(([user, datas, count]) => {
                res.render('tableSensorData', {
                    layout: 'main',
                    user: util.mongooseToObject(user),
                    datas: util.multipleMongooseToObject(datas),
                    pageNumber: page,
                    pageLeft: util.pageLeft(page),
                    pageRight: util.pageRight(page),
                    pagePrevious: page - 1,
                    pageNext: page + 1,
                    pageLast: parseInt(count / PAGE_MAX)
                })
            })
            .catch(next)
    }

    tableActionHistory(req, res, next) {
        const page = parseInt(req.query.page);

        Promise.all([
            User.findOne({ user: req.cookies.user }),
            Action.find({}).sort({ createdAt: -1 }).limit(20),
            Action.countDocuments()
        ])
            .then(([user, actions, count]) => {
                res.render('tableActionHistory', {
                    layout: 'main',
                    actions: multipleMongooseToObject(actions),
                    user: mongooseToObject(user),
                    pageNumber: page,
                    pageLeft: util.pageLeft(page),
                    pageRight: util.pageRight(page),
                    pagePrevious: page - 1,
                    pageNext: page + 1,
                    pageLast: parseInt(count / PAGE_MAX)
                })
            })
            .catch(next)
    }

    actions(req, res, next) {
        const action = new Action({
            sensorId: 'packetId' + Math.floor(Math.random() * 1000),
            name: req.cookies.user,
            action: req.body.action
        });
        action.save()
    }

    actionLed(req, res, next) {
        const { action, mes } = req.body;
        client.publish('led', action);
    }

    search(req, res, next) {
        const page = parseInt(req.query.page);
        const searchTerm = req.body.search;
        Promise.all([
            User.findOne({ user: req.cookies.user }),
            Data.find({
                $or: [
                    { sensorId: { $regex: new RegExp(searchTerm, "i") } },
                    { temperature: parseFloat(searchTerm) },
                    { humidity: parseFloat(searchTerm) },
                    { light: parseFloat(searchTerm) },
                ]
            })
        ])
            .then(([user, datas]) => {
                res.render('tableSensorData', {
                    layout: 'main',
                    user: util.mongooseToObject(user),
                    datas: util.multipleMongooseToObject(datas),
                    pageNumber: page,
                    pageLeft: util.pageLeft(page),
                    pageRight: util.pageRight(page),
                    pagePrevious: page - 1,
                    pageNext: page + 1,
                    pageLast: parseInt(datas.length/PAGE_MAX)
                })
            }).catch(next)
    }

    filter(req, res, next) {
        const page = parseInt(req.query.page);
        const { startTime, endTime } = req.body;
        Promise.all([
            User.findOne({ user: req.cookies.user }),
            Action.find({
                createdAt: {
                    $gte: new Date(startTime),
                    $lte: new Date(endTime),
                },
            })
        ]).then(([user, actions]) => {
            res.render('tableActionHistory', {
                layout: 'main',
                user: util.mongooseToObject(user),
                actions: util.multipleMongooseToObject(actions),
                pageNumber: page,
                pageLeft: util.pageLeft(page),
                pageRight: util.pageRight(page),
                pagePrevious: page - 1,
                pageNext: page + 1,
                // pageLast: parseInt(count / PAGE_MAX)
            })
        }).catch(next)

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
            light: json.light,
            gas: json.gas
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