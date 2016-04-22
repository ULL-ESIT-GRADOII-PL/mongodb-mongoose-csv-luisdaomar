(function() {
  "use strict";
  const util = require('util');
  const mongoose = require('mongoose');

  mongoose.connect('mongodb://localhost/');
  const csv = mongoose.Schema({ 
    id : String,
    cadena : String
  });

  const Modelo = mongoose.model("Csv", csv);

  let c1 = new Modelo({id:"input 1", cadena:'"producto", "precio", "camisa", "4,3", "libro de O\"Reilly", "7,2"'});
  let c2 = new Modelo({id:"input 2", cadena:'"producto", "precio",  "fecha", "camisa", "4,3", "14/01", "libro de O\"Reilly", "7,2", "13/02"'});
  let c3 = new Modelo({id:"input 3", cadena:'"edad",  "sueldo",  "peso" , "6000€",  "90Kg" 47,       "3000€",  "100Kg"'});
    
  let p1 = c1.save(function (err) {
    if (err) { console.log(`Hubieron errores:\n${err}`); return err; }
    console.log(`Saved: ${c1}`);
  });

  let p2 = c2.save(function (err) {
    if (err) { console.log(`Hubieron errores:\n${err}`); return err; }
    console.log(`Saved: ${c2}`);
  });

  let p3 = Modelo.create(c3, function (err, x) {
    if (err) { console.log(`Hubieron errores:\n${err}`); return err; }
    console.log(`Saved p3: ${x}`);
  });

  Promise.all([p1, p2, p3]).then( (value) => { 
    console.log(util.inspect(value, {depth: null}));  
    mongoose.connection.close(); 
  });
  
  module.exports = Modelo;
})();