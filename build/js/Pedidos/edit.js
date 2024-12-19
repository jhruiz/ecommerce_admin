//var urlC = 'https://cotoolsback.cotools.co/public/';
var urlC = 'http://localhost:85/cotoolsback/public/';
var archivosCli = "";

/**
 * Funcion para actualizar el estado del pedido
 */
function actualizarEstadoPedido() {
    var estadoId = $('#estadosPedido').val();
    var pedidoId = $('#pedidoId').val();

    $.ajax({
        method: "GET",
        url: urlC + "pedido/actualizarestado",
        data: { pedidoId: pedidoId, idEst: estadoId},
        success: function(respuesta) {
                        
            // Valida si la respuesta no fue correcta para la actualización del estado
            if ( !respuesta.estado ) {
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
 * Carga el archivo pdf guia de la transportadora
 */
var cargarGuiaTransportadora = function() {
    archivosCli = "";

    $('.files-upload').each( function(index,element) {

        // instancia un form data y se le pasa el archivo del input    
        file = $('#' + element.id)['0'].files['0'];
        var form_data = new FormData();
        form_data.append('file', file);

        $.ajax({
            method: "POST",
            url: '../../pages/pedidos/cargarguia.php',
            data: form_data,
            contentType: false,
            processData: false,
            async: false,
            success: function(respuesta) {

                if(respuesta == '0'){
                    var mensaje = 'No fue posible cargar la guia de la transportadora.';
                    sweetMessage('warning', mensaje);
                } else {
                    var mensaje = 'Guia de la transportadora cargada correctamente.';
                    sweetMessage('success', mensaje);

                    // setea la variable global del archivo con el nombre cargado
                    archivosCli = respuesta;
                }
                
            },
            error: function() {
                var mensaje = 'Se presentó un error. Por favor, inténtelo mas tarde.';
                sweetMessage('error', mensaje);
            }
        });  
    });    
}

/**
 * Validar si el formato y el tamaño del archivo son los correctos
 * @param {*} datos 
 * @returns 
 */
var validarDocumento = function( datos ) {
    resp = true;

    var dataFI = $('#' + datos.id).prop('files')[0];

    // valida el tamaño del archivo
    if(dataFI.size > 1000000) {
        var mensaje = 'El tamaño máximo del archivo es 1MB.';
        sweetMessage('warning', mensaje);
        $('#' + datos.id).val('');
        resp = false;
    }

    // valida el formato del archivo
    if(dataFI.name.split('.')['1'].toLowerCase() != 'pdf') {
        var mensaje = 'Solo se permiten archivos en formato pdf.';
        sweetMessage('warning', mensaje);
        $('#' + datos.id).val('');
        resp = false;
    }    

    return resp;
}

/**
 * Realiza el proceso para cargar la guia de la transportadora
 * @param {*} data 
 */
function cargarGuia( data ) {

    // valida si el formato y peso del archivo son correctos
    if(validarDocumento( data )) {

        // carga los archivos
        cargarGuiaTransportadora();

        var pedidoId = $('#pedidoId').val();

        $.ajax({
            method: "GET",
            url: urlC + "pedido/actualizarguia",
            data: {pedidoId: pedidoId, documento: archivosCli},
            success: function(respuesta) {
                $('#doc_guia').val('');
                if(!respuesta.estado){
                    sweetMessage('warning', respuesta.mensaje);             
                } 
            },
            error: function() {
                var mensaje = 'Se presentó un error. Por favor, inténtelo mas tarde.';
                sweetMessage('error', mensaje);
            }
        });        
    }

}