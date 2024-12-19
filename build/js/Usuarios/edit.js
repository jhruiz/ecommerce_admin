//var urlC = 'https://cotoolsback.cotools.co/public/';
var urlC = 'http://localhost:85/cotoolsback/public/';

/**
 * Obtiene los perfiles seleccionados
 */
 var perfilesSeleccionados = function() {
    var perfiles = [];

    $('.chk-perfiles').each(function() {
        if ($(this).prop('checked') ) {
            perfiles.push($(this).prop("id"));
        }
    });

    return perfiles;
}

/**
 * Actualiza la información del usuario
 */
function actualizarUsuario() {
    var perfiles = perfilesSeleccionados();
    var estado = $('#estadosUsuario').val();
    var usuarioId = $('#usuarioId').val();
    var email = $('#email').val();

    $.ajax({
        method: "GET",
        async: false,
        url: urlC + "usuario/actualizar",
        data: { id: usuarioId, estado: estado, perfiles: perfiles, email: email },
        success: function(respuesta) {       
            // Valida si la respuesta es correcta
            if ( respuesta.estado ) {
                var mensaje = 'Usuario actualizado correctamente';
                sweetMessage('success', mensaje);
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

/**
 * Setea la información del usuario con los datos obtenidos desde API
 * @param {*} data 
 */
var setDatosUsuario = function(data) {

    $('.user-data').prop("disabled", true);

    $('#nombre').val(data['0'].primer_nombre + ' ' + data['0'].segundo_nombre + ' ' + data['0'].primer_apellido + ' ' + data['0'].segundo_apellido);   
    $('#email').val(data['0'].email);
    $('#tipo_documento').val(data['0'].tipo_documento);
    $('#identificacion').val(data['0'].nit);
    $('#tipo_persona').val(data['0'].tipo_persona);
    $('#regimen').val(data['0'].regimen);
    $('#ciudad').val(data['0'].ciudad);
    $('#direccion').val(data['0'].direccion);
    $('#telefono').val(data['0'].telefono);
    $('#celular').val(data['0'].celular);

    data.forEach(element => {
        $('#estadosUsuario').val(element.estado_id);
        $('#' + element.perfile_id).prop('checked', true);
    });
}

/**
 * Genera el html con los perfiles configurados en la base de datos
 */
 var crearCheckPerfiles = function(data) {
    var htmlPerfiles = '';
    
    data.forEach(element => {
        htmlPerfiles += '<div>';
        htmlPerfiles += '<input type="checkbox" id="' + element.id + '" class="chk-perfiles">';
        htmlPerfiles += '<label for="' + element.id + '"> &nbsp; Perfil ' + element.descripcion.toLowerCase() + '</label>';
        htmlPerfiles += '</div>';
    });

    $('#check-perfiles').html(htmlPerfiles);
}

/**
 * Crea el combo select con la info recibida por API
 */
var crearSelectEstados = function(objEstados) {
    
    var htmlSelStates = '<label for="estadosUsuario">Estados</label>';
    htmlSelStates += '<select name="estadosUsuario" class="custom-select rounded-0" id="estadosUsuario">';

    objEstados.forEach(element => {
        htmlSelStates += '<option value="' + element.id + '">' + element.descripcion + '</option>';
    });

    htmlSelStates += '</select>';

    $('#cmb-states').html(htmlSelStates);
}

/**
 * Se obtienen los estados por API
 */
var obtenerEstados = function(){
    $.ajax({
        method: "GET",
        async: false,
        url: urlC + "estados/obtener",
        success: function(respuesta) {       
            // Valida si la respuesta es correcta
            if ( respuesta.estado ) {
                crearSelectEstados(respuesta.data);
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

/**
 * Obtiene los perfiles configurados en la base de datos y setea en un listado
 */
var obtenerPerfiles = function(){
    $.ajax({
        method: "GET",
        async: false,
        url: urlC + "perfiles/obtener",
        success: function(respuesta) {       
            // Valida si la respuesta es correcta
            if ( respuesta.estado ) {   
                crearCheckPerfiles(respuesta.data);
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
 * Obtiene la informacion de un usuario específico
 */
 var obtenerUsuario = function() {
    var usuarioId = $('#usuarioId').val();

    $.ajax({
        method: "GET",
        url: urlC + "usuario/obtener",
        data: { usuarioId: usuarioId }, 
        success: function(respuesta) {  
            
            $('.preloader').hide("slow");
            
            // Valida si la respuesta es correcta para generar el data table
            if ( respuesta.estado ) {
                setDatosUsuario(respuesta.data);
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
 * Permite visualizar cada documento
 * @param {*} data 
 */
function verDocumento(data) {

    // Abre el visor del documento
    var document = '<embed src="../../docs/assets/documents/' + data.value + '" type="application/pdf" width="100%" height="600px" />'
    $('#view-documents').html(document);
    
    // ajax para verificar documento
    $.ajax({
        method: "GET",
        url: urlC + "documentosusr/check",
        data: { documentoUsuarioId: data.id }, 
        success: function(respuesta) {       

            // Valida si la respuesta es correcta para mostrar los documentos
            if ( respuesta.estado ) {

                var mensaje = 'El documento ha sido verificado correctamente';
                sweetMessage('success', mensaje);

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
 * obtiene los documentos cargados por el usuario
 */
var obtenerDocumentos = function() {
    var usuarioId = $('#usuarioId').val();

    $.ajax({
        method: "GET",
        url: urlC + "documentosusr/obtener",
        data: { usuarioId: usuarioId }, 
        success: function(respuesta) {       
            // Valida si la respuesta es correcta para mostrar los documentos
            if ( respuesta.estado ) {

                var radocumento = "";
                respuesta.data.forEach(element => {
                    var verificado = element.verificado ? ' (Verificado)' : '';
                    var success = element.verificado ? 'text-success' : '';
                    radocumento += '<div class="form-check">';
                    radocumento += '<input class="form-check-input ' + success + '" type="radio" name="rd-documento" id="' + element.id + '" value="' + element.url + '" onclick="verDocumento(this)">';
                    radocumento += '<label class="form-check-label ' + success + '"><b>' + element.descripcion + verificado + '</b></label>';
                    radocumento += '</div>';
                })

                $('#radio-documentos').html(radocumento);

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
    obtenerEstados();
    obtenerPerfiles();
    obtenerDocumentos();
    obtenerUsuario();
});