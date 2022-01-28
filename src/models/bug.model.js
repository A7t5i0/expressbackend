const mongoose = require('mongoose');

const Bug = new mongoose.schema(
    {
        buggedFeature: {type: String, required: true},
        assingedTo: {type: String, required: true},
        fixedStatus: {type: String, required: true},
    },
    {collection: 'bug-data'}
)

const bugmodel = mongoose.model("BugData", Bug)
module.exports = Bug;
