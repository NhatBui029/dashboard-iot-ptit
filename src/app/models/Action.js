const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

mongoose.plugin(slug);

const Action = new Schema({
    sensorId: {type: String},
    name: {type: String},
    action: {type: String}
},{
    timestamps: true,
});

Action.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})
module.exports = mongoose.model('Action',Action);
