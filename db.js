var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
 
var csv = new Schema({
    id : Number,
    cadena : String
});
 
var modelo = mongoose.model("csv", csv);
mongoose.connect("mongodb://localhost/");