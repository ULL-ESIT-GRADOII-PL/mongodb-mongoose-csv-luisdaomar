const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/");

var Schema   = mongoose.Schema;
const csv = new Schema({
    id : Number,
    cadena : String
});
const modelo = mongoose.model("csv", csv);

app.set('port', (process.env.PORT || 5000));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));

const calculate = require('./models/calculate.js');

app.get('/save', (request, response) => {
  var objecto = new modelo ({cadena: request.query.input});
  var aux = objecto.save(function (err) {
    if (err) { console.log(`ERROR:\n${err}`); return err; }
      console.log(`Guardado: ${objecto}`);
    });
    Promise.all([aux]).then( (id) => {
      mongoose.connection.close();
    });
    response.render ('index', { title: 'CSV'});
});

app.get('/', (request, response) => {
  response.render('index', {title: 'CSV con ajax'});
});

app.get('/csv', (request, response) => {
  response.send ({"rows": calculate(request.query.input)});
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});
