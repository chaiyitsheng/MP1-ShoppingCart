var mongoose = require('mongoose');

var CounterSchema = new mongoose.Schema({
incrementId:String,
seq:Number
});

CounterSchema.methods.toJSON = function() {
    var counter = this.toObject();
    return counter;
};

module.exports = mongoose.model('Counter', CounterSchema);