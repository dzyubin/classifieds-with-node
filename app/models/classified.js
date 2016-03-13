var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClassifiedSchema = new Schema({

    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    created: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Classified', ClassifiedSchema);