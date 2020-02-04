/*
* 2020, Goorumlabs
* By EUNGJU
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true)

var tagSchema = new Schema({
    uid: { type: String, required: true, unique: true, index: true},
    balance: { type: Number, default: 0, index: true },
    point: { type: Number, default: 0, index: true },
    regDate: { type: Date, index: true },
    timestamp: { type: Date, index: true },
    indexNumber: { type: Number }
}, { collection: 'tags', versionKey: false});

module.exports = mongoose.model('tag', tagSchema);