/*
* 2020, Goorumlabs
* By EUNGJU
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true)

var logSchema = new Schema({
    uid: { type: String, index: true },
    balance: { type: Number, index: true },
    point: { type: Number, index: true },
    timestamp: { type: Date, default: Date.now, index: true },
    type: { type: String, index: true },
    deviceId: { type: String, index: true},
    amount: { type: Number },
    bonusPoint: { type: Number },
    payment: { type: Object },
    indexNumber: { type: Number }
}, { collection: 'logs', versionKey: false });

module.exports = mongoose.model('log', logSchema);