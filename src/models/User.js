const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true, select: false },
    admin: { type: Boolean }
});

module.exports = User = mongoose.model('User', UserSchema);