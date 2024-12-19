var urlC = 'http://localhost:85/cotoolsback/public/';

/**
 * Setea el div content con el formulario para crear un nuevo usuario
 */
 function nuevaCategoria() {
    $.ajax({
        method: "GET",
        url: '../../pages/categorias/add.html',
        success: function(respuesta) {
            $('#content-data').html(respuesta);         
        },
        error: function() {
            var mensaje = 'Se presentó un error. Por favor, inténtelo mas tarde.';
            sweetMessage('error', mensaje);
        }
      });  
}

/**
 * Funcion para editar una categoria
 * @param {*} data 
 */
 function editarCategoria(data) {

    $.ajax({
        method: "GET",
        url: '../../pages/categorias/edit.html',
        success: function(respuesta) {
            $('#content-data').html(respuesta);
            $('#categoriaId').val(data.id);
        },
        error: function() {
            var mensaje = 'Se presentó un error. Por favor, inténtelo mas tarde.';
            sweetMessage('error', mensaje);
        }
      }) 
}

/**
 * Crea el datatable con la información obtenida del api
 * @param {*} data 
 */
 var generarDataTable = function( data ) {

    $('#datatable-categories').DataTable( {
        data: data,        
        columns: [
            { title: "Descripción" },
            {
                "render": function ( data, type, row ) {
                    return '<i class="fas fa-edit icon-selectable center" id="' + data + '" onclick="editarCategoria(this)"></i>';
                },
                "orderable": false,
                "searchable": false
            }
        ],
        dom: 'Bfrtip',
        buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
            'pdfHtml5'
        ], 
        "responsive": true, 
        "lengthChange": true, 
        "autoWidth": true,
        "info": true,
        "language": {
            "search": "Buscar",
            "zeroRecords": "No se encontraron registros.",
            "paginate": {
                "first": "Primer Página",
                "last": "Última Página",
                "next": ">>",
                "previous": "<<",
              },
            "info": "Mostrando página _PAGE_ de _PAGES_",
          }
    });     
}

/**
 * Genera un array de array del objeto respueta
 * @param {*} data 
 * @returns 
 */
 var organizarDatos = function( data ) {
    var arrItems = [];

    // se recorre la respuesta y se genera un array de arrays.
    data.forEach(element => {
        arrItem = [
            element.descripcion,
            element.id  
        ];

        arrItems.push(arrItem);
    });

    return arrItems;
}

/**
 * Obtiene el listado de categorias creados en la base de datos de cotools
 */
var obtenerCategorias = function() {
    $.ajax({
        method: "GET",
        url: urlC + "categorias/obtener",
        success: function(respuesta) {

            $('.preloader').hide("slow");
            
            // Valida si la respuesta es correcta para generar el data table
            if ( respuesta.estado ) {
                generarDataTable(organizarDatos(respuesta.data));    
            } else {
                sweetMessage('warning', respuesta.mensaje);
            }
            
        },
        error: function() {
            var mensaje = 'Se produjo un error. Por favor, inténtelo nuevamente'.
            sweetMessage('error', mensaje);
        }
    });   
}

$( document ).ready(function() {
    obtenerCategorias();
});