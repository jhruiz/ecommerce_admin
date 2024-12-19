// var urlC = 'https://cotoolsback.cotools.co/public/';
var urlC = 'http://localhost:85/cotoolsback/public/';
var estadoPedidoId = "";

/**
 * Crea el select con los estados configurados en cotools
 * @param {*} data 
 */
 var crearSelectEstadoPedido = function( data ) {

    var htmlSelStates = '<label for="estadosPedido">Estados</label>';
    htmlSelStates += '<select class="custom-select" id="estadosPedido" onchange="actualizarEstadoPedido()">';

    data.forEach(element => {
        selected = estadoPedidoId == element.id ? 'selected' : '';
        htmlSelStates += '<option value="' + element.id + '" ' + selected + '>' + element.descripcion + '</option>';
    });

    htmlSelStates += '</select>';

    $('#cmb-states').html(htmlSelStates);  
}

/**
 * Obtiene los estados del pedido configurados en la base de datos de cotools
 */
var obtenerEstadosPedido = function() {

    $.ajax({
        method: "GET",
        url: urlC + "estadopedidos/obtener",
        success: function(respuesta) {
                        
            // Valida si la respuesta es correcta para generar el data table
            if ( respuesta.estado ) {
                crearSelectEstadoPedido(respuesta.data);                
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
 * Setea la cabecera de los datos del pedido
 * @param {*} data 
 */
var setCabeceraPedido = function( data ) {
    
    // Obtiene la fecha actual y setea la factura
    var date = new Date();
    var dia = date.getDate();
    var mes = date.getMonth() + 1;
    var anio = date.getFullYear();
    $('#fechaActual').append(dia + '-' + mes + '-' + anio);
    $('#codigo-factura').append( generarNumeroPedidoF( data['0'] ) );
    $('#nombre-cliente').append(data['0'].primer_nombre+' '+data['0'].segundo_nombre+' '+data['0'].primer_apellido+' '+data['0'].segundo_apellido);
    $('#ident-cliente').append(data['0'].nit);
    $('#fecha-pedido').append(data['0'].fechapedido);
}

/**
 * Genera el número de pedido que muestra al cliente tras aprobarlo
 * @param {*} data 
 */
 var generarNumeroPedidoF = function( data ) {     
    
    var numPedido = '';

    // separa la fecha por el espacio entre la fecha y la hora
    var arrDate = data.fechapedido.split(' ');

    // genera el número de pedido con el id del pedido, el id del usuario y la hora sin los dos puntos
    numPedido = data.id.toString() + data.usuario_id.toString() + arrDate['1'].replaceAll(':', '');

    return numPedido;
}

/**
 * Setea los datos de los items en la tabla
 * @param {*} data 
 */
var setDatosItems = function( data ) {
    var infoDetalle = "";
    data.forEach(element => {
        infoDetalle += '<tr>';
        infoDetalle += '<td>' + element.desc_item + '</td>';
        infoDetalle += '<td class="text-center">' + element.cantidad + '</td>';
        infoDetalle += '<td class="text-right">' + numberFormater(element.vlr_item) + '</td>';
        infoDetalle += '<td class="text-center">' + element.vlr_impuesto + '</td>';
        infoDetalle += '<td class="text-right">' + numberFormater(element.baseTtal) + '</td>';
        infoDetalle += '</td>';
    });
    
    $('#detalle-pedido').html(infoDetalle);
}

/**
 * Setea la información del pago del pedido
 * @param {*} ttles 
 */
var setTtalesPedido = function( ttles ) {
    var htmlDetPag = "";

    htmlDetPag += '<tr>';
    htmlDetPag += '<th colspan="4" class="text-right">Subtotal neto</th>';
    htmlDetPag += '<td class="text-right">' + numberFormater(ttles['2']) + '</td>';
    htmlDetPag += '</tr>';

    htmlDetPag += '<tr>';
    htmlDetPag += '<th colspan="4" class="text-right">IVA</th>';
    htmlDetPag += '<td class="text-right">' + numberFormater(ttles['3']) + '</td>';
    htmlDetPag += '</tr>';

    htmlDetPag += '<tr>';
    htmlDetPag += '<th colspan="4" class="text-right">Total a pagar</th>';
    htmlDetPag += '<td class="text-right">' + numberFormater(ttles['4']) + '</td>';
    htmlDetPag += '</tr>';
    
    $('#detalle-ttles').html(htmlDetPag);    
}



/**
 * Setea toda la informacion del pedido a detalle
 * @param {*} data 
 */
var setDatosPedido = function(respuesta) {

    setCabeceraPedido(respuesta.data);

    setDatosItems(respuesta.data);

    setTtalesPedido(respuesta.ttles);

}

/**
 * Obtiene la informacion de un pedido registrado en la base de datos
 */
var obtenerInfoPedido = function() {
    var pedidoId = $('#pedidoId').val();

    $.ajax({
        method: "GET",
        url: urlC + "pedidodetalle/obtenerdetalle",
        data: { pedidoId: pedidoId },
        async: false,
        success: function(respuesta) {
            estadoPedidoId = respuesta.data['0'].estadoId;
                        
            // Valida si la respuesta es correcta para generar el data table
            if ( respuesta.estado ) {
                setDatosPedido( respuesta );
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

var imprimirFactura = function() {
    window.print();
}

$( document ).ready(function() {
    obtenerInfoPedido();
    obtenerEstadosPedido();
});