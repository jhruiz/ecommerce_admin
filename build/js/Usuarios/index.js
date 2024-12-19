// var urlC = 'https://cotoolsback.cotools.co/public/';
var urlC = 'http://localhost:85/cotoolsback/public/';

/**
 * Funcion para sincronizar usuarios desde datax al front de admin cotools
 */
function sincronizarUsuarios() {

    $('.preloader').show();

    $.ajax({
        method: "GET",
        url: urlC + "sincronize-users",
        success: function(respuesta) {

            $('.preloader').hide("slow");
                        
            // Valida si la respuesta es correcta para generar el data table
            if ( respuesta.estado ) {
                var mensaje = 'Usuarios sincronizados correctamente.';
                sweetMessage('success', mensaje);                
            } else {
                sweetMessage('warning', respuesta.mensaje);
            }
            
        },
        error: function() {
            var mensaje = 'Se produjo un error. Por favor, inténtelo nuevamente.'.
            sweetMessage('error', mensaje);
        }
    });
}


/**
 * Setea el div content con el formulario para crear un nuevo usuario
 */
function nuevoUsuario() {
    $.ajax({
        method: "GET",
        url: '../../pages/usuarios/add.html',
        success: function(respuesta) {
            $('#content-data').html(respuesta);         
        },
        error: function() {
            var mensaje = 'Se presentó un error. Por favor, inténtelo mas tarde.';
            sweetMessage('error', mensaje);
        }
      })     
}


/**
 * Funcion para editar un usuario
 * @param {*} data 
 */
function editarUsuario(data) {
    $.ajax({
        method: "GET",
        url: '../../pages/usuarios/edit.html',
        success: function(respuesta) {
            $('#content-data').html(respuesta);
            $('#usuarioId').val(data);
        },
        error: function() {
            var mensaje = 'Se presentó un error. Por favor, inténtelo mas tarde.';
            sweetMessage('error', mensaje);
        }
      }) 
}

/**
 * Genera un array de array del objeto respueta
 * @param {*} data 
 * @returns 
 */
var organizarDatos = function( data ) {
    var arrUsuarios = [];

    // se recorre la respuesta y se genera un array de arrays.
    data.forEach(e => {
        arrUsuario = [
            e.primer_nombre + ' ' + e.segundo_nombre + ' ' + e.primer_apellido + ' ' + e.segundo_apellido,
            e.nit,
            e.email,
            e.estado,
            e.id            
        ];

        arrUsuarios.push(arrUsuario);
    });

    return arrUsuarios;
}

/**
 * Crea el datatable con la información obtenida del api
 * @param {*} data 
 */
var generarDataTable = function( data ) {

    $('#datatable-users').DataTable( {
        data: data,        
        columns: [
            { title: "Nombre" },
            { title: "Identificación" },
            { title: "Email" },
            { title: "Estado" },
            {
                "render": function ( data, type, row ) {
                    return '<i class="fas fa-edit icon-selectable center" onclick="editarUsuario(' + data + ')"></i>';
                    // return data;
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
 * Obtiene la informacion de los usuarios
 */
var obtenerUsuarios = function() {

    $.ajax({
        method: "GET",
        url: urlC + "usuarios/obtener",
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
    })
}

$( document ).ready(function() {
    validarLogin();
    obtenerUsuarios();
});