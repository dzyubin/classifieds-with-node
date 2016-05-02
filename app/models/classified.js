var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClassifiedSchema = new Schema({

    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    created: { type: Date, default: Date.now },
    title: String,
    price: Number,
    image: String,
    category: [],
    contact: {
        name: String,
        phone: String,
        email: String
    }

});

module.exports = mongoose.model('Classified', ClassifiedSchema);