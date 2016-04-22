const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

app.set('port', (process.env.PORT || 5000));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));

const calculate = require('./models/calculate.js');

mongoose.connect('mongodb://localhost/chuchu');
  const csv = mongoose.Schema({ 
    name : String,
    cadena : String
});

const Modelo = mongoose.model("Csv", csv);

app.get('/save', (request, response) => {
      Modelo.find({}, function(err, cadena) {
        if (err)
            return err;
        if (cadena.length >= 4) {
          Modelo.find({ cadena: cadena[0].cadena }).remove().exec();
        }
      });
      
      var obj = new Modelo({name: request.query.user, cadena: request.query.input});
      
      var aux = obj.save(function (err) {
        if (err) { console.log(`Hubieron errores:\n${err}`); return err; }
        console.log(`Saved: ${obj}`);
        Promise.all([aux]).then( (id) => {
          mongoose.connection.close();
        });
        response.render ('index', { title: 'CSV'});
      });
});

/*app.get('/loadById', (request, response) =>{    //Funcion que devuelve el los datos con la id
  modelo.findById(req.params.id, function(err, cadena) {
    if(err){console.log(`ERROR:\n${err}`);return err;}
    console.log(req.params);
     res.send('id: '+(req.params.id || 'unknown' ));
  })
});*/

app.get('/', (request, response) => {
  response.render('index', {title: 'CSV con ajax'});
});

app.get('/csv', (request, response) => {
  response.send ({"rows": calculate(request.query.input)});
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});
