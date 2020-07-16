const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ProductDB');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    name:String,
    email: String,
    password: String,
    type:String
});

var Userdata = mongoose.model('user', UserSchema);
module.exports = Userdata;
