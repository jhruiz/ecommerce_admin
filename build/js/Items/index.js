// var urlC = 'https://cotoolsback.cotools.co/public/';
var urlC = 'http://localhost:85/cotoolsback/public/';

/**
 * Funcion para editar un usuario
 * @param {*} data 
 */
 function editarItem(data) {
    $.ajax({
        method: "GET",
        url: '../../pages/items/edit.html',
        success: function(respuesta) {
            $('#content-data').html(respuesta);
            $('#itemId').val(data.id);
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

    $('#datatable-items').DataTable( {
        data: data,        
        columns: [
            { title: "Referencia" },
            { title: "Descripción" },
            { title: "Grupo" },
            { title: "Linea" },
            {
                "render": function ( data, type, row ) {
                    return '<i class="fas fa-edit icon-selectable center" id="' + data + '" onclick="editarItem(this)"></i>';
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
 var organizarDatos = function( data, datagrp, dataln ) {
    var arrItems = [];

    // se recorre la respuesta y se genera un array de arrays.
    data.forEach(element => {

        var arrItem = [
            element.referencia,
            element.item_desc,
            element.grp_desc,
            element.ln_desc,
            element.item_id,  
        ];

        arrItems.push(arrItem);
    });

    return arrItems;
}

/**
 * Obtiene los items registrados en datax
 */
var obtenerItems = function(){

    $.ajax({
        method: "GET",
        url: urlC + "items/obtener",
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
    obtenerItems();
});