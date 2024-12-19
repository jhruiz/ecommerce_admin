// var urlC = 'https://cotoolsback.cotools.co/public/';
var urlC = 'http://localhost:85/cotoolsback/public/';

/**
 * Funcion para ver el detalle del pedido
 * @param {*} data 
 */
 function verPedido(data) {
    $.ajax({
        method: "GET",
        url: '../../pages/pedidos/view.html',
        success: function(respuesta) {
            $('#content-data').html(respuesta);
            $('#pedidoId').val(data);
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
    var arrPedidos = [];

    // se recorre la respuesta y se genera un array de arrays.
    data.forEach(element => {

        var nro_pdweb = generarNumeroPedido( element );
        arrPedido = [
            nro_pdweb,     
            element.primer_nombre+' '+element.segundo_nombre+' '+element.primer_apellido+' '+element.segundo_apellido,     
            element.nit,     
            element.email,     
            element.descripcion,
            element.created_at,     
            element.id,     
        ];

        arrPedidos.push(arrPedido);
    });

    return arrPedidos;
}

/**
 * Crea el datatable con la información obtenida del API
 * @param {*} data 
 */
 var generarDataTable = function( data ) {

    $('#datatable-pedidos').DataTable( {
        data: data,        
        columns: [
            { title: "Código Pedido" },
            { title: "Cliente" },
            { title: "Identificación" },
            { title: "Email" },            
            { title: "Estado" },
            { title: "Fecha Pedido" },
            {
                "render": function ( data, type, row ) {
                    return '<i class="fas fa-eye icon-selectable center" onclick="verPedido(' + data + ')"></i>';
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
 * Obtiene todos los pedidos registrados
 */
var obtenerPedidos = function() {
    $.ajax({
        method: "GET",
        url: urlC + "pedido/obtenerpedidos",
        success: function(respuesta) {
                        
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

/**
 * Genera el número de pedido que muestra al cliente tras aprobarlo
 * @param {*} data 
 */
 var generarNumeroPedido = function( data ) {     
    
    var numPedido = '';

    // separa la fecha por el espacio entre la fecha y la hora
    var arrDate = data.created_at.split('T');
    var arrHour = arrDate['1'].split('.');

    // genera el número de pedido con el id del pedido, el id del usuario y la hora sin los dos puntos
    numPedido = data.id.toString() + data.usuario_id.toString() + arrHour['0'].replaceAll(':', '');

    return numPedido;
}

$( document ).ready(function() {
    obtenerPedidos();    
});