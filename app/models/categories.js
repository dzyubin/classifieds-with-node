var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategoriesSchema = new Schema({

    categories: []

});

module.exports = mongoose.model('Categories', CategoriesSchema);