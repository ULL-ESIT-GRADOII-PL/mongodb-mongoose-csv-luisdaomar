// See http://en.wikipedia.org/wiki/Comma-separated_values
(() => {
"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

const resultTemplate = `
<div class="contenido">
      <table class="center" id="result">
          <% _.each(rows, (row) => { %>
          <tr class="<%=row.type%>">
              <% _.each(row.items, (name) =>{ %>
              <td><%= name %></td>
              <% }); %>
          </tr>
          <% }); %>
      </table>
  </p>
</div>
`;

/* Volcar la tabla con el resultado en el HTML */
const fillTable = (data) => {
  $("#finaltable").html(_.template(resultTemplate, { rows: data.rows }));
};

/* Volcar en la textarea de entrada
 * #original el contenido del fichero fileName */
const dump = (fileName) => {
  $.get(fileName, function (data) {
      $("#original").val(data);
  });
};

const handleFileSelect = (evt) => {
  evt.stopPropagation();    //Detiene la propagación po el DOM
  evt.preventDefault();    //Evita que se active la funciones por defecto

 var files = evt.target.files;

  var reader = new FileReader();
  reader.onload = (e) => {              //Estas lineas son las encargadas para cargar y preparar el fichero para ser leido

    $("#original").val(e.target.result);
  };
  reader.readAsText(files[0]) //lee el fichero
}

/* Drag and drop: el fichero arrastrado se vuelca en la textarea de entrada */
const handleDragFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.

  var reader = new FileReader();
  reader.onload = (e) => {

    $("#original").val(e.target.result);
    evt.target.style.background = "white";
  };
  reader.readAsText(files[0])
}

const handleDragOver = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
  evt.target.style.background = "yellow";
}

$(document).ready(() => {
    let original = document.getElementById("original");
    if (window.localStorage && localStorage.original) {
      original.value = localStorage.original;
    }
    $("#parse").click( () => {
        if (window.localStorage) localStorage.original = original.value;
        $.get("/csv", /* Request AJAX para que se calcule la tabla */
          { input: original.value },
          fillTable,
          'json'
        );
   });
   /* botones para rellenar el textarea */
   $('button.example').each( (_,y) => {     //Se llama a la clase example(contiene los botones declarados en el html5.El underscores es usado ya que a la funcion es obligatoria pasarle un parametro pero ese nos da igual.La y hace referencia al elemento que se llama )
     $(y).click( () => { dump(`${$(y).text()}.txt`); }); //Cuando se clickea en elemento y se activa la funcion dump y se le pasa el nombre del elemento concatenado con txt
   });

    // Setup the drag and drop listeners.
    //var dropZone = document.getElementsByClassName('drop_zone')[0];
    let dropZone = $('.drop_zone')[0];
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleDragFileSelect, false);
    let inputFile = $('.inputfile')[0];
    inputFile.addEventListener('change', handleFileSelect, false);
 });
})();
