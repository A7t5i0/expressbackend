const mongoose = require('mongoose');

const User = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type:String, required: true}
    },
    {collection: 'user-data'},
)

const model = mongooose.model('UserData', User)
module.exports = model