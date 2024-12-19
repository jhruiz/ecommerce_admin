// var urlC = 'https://cotoolsback.cotools.co/public/';
var urlC = 'http://localhost:85/cotoolsback/public/';

/**
 * Genera los checkbox con los grupos padre obtenidos de datax
 * @param {*} data 
 */
var generarCheckGrupos = function(data) {

    var htmlGrupos = "";
    htmlGrupos += '<div class="row">';
    data.forEach(element => {
        htmlGrupos += '<div class="col-md-4">';
        htmlGrupos += '<input type="checkbox" id="grup_' + element.id + '" class="chk-grupos">';
        htmlGrupos += '<label for="' + element.id + '" title="' + element.descripcion.toLowerCase() + '"> &nbsp;' + obtenerNombreProducto(element.descripcion.toLowerCase()) + '</label>';
        htmlGrupos += '</div>';
    });

    htmlGrupos += '</div>';       

    $('#grupos').html(htmlGrupos);
    $('.preloader').hide("slow");

}

/**
 * Valida el tamaño de la descripcion del producto y formatea un tamaño estandar
 * @param {*} descripcion 
 * @returns 
 */
 var obtenerNombreProducto = function(descripcion) {
    var nDescripcion = "";
    var limite = 26;
    
    if(descripcion != '') {
        if( descripcion.length > limite ) {
            nDescripcion = descripcion.substring(0,limite) + "...";
        } else {
            nDescripcion = descripcion;
        }
    }

    return nDescripcion;
}



/**
 * Obtiene todos los grupos padre registrados en datax
 */
var obtenerGrupos = function() {

    $.ajax({
        method: "GET",
        url: urlC + "grupos/obtener",
        success: function(respuesta) {
            
            // Valida si la respuesta es correcta
            if ( respuesta.estado ) {                
                generarCheckGrupos(respuesta.data);
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
 * Obtiene los grupos seleccionados para una categoria
 */
var obtenerGruposSeleccionados = function() {
    var grupos = [];
    $('.chk-grupos').each(function() {
        if($(this).is(':checked')){
            grupos.push($(this).prop('id'));
        } 
    });
    
    return grupos;
}

/**
 * Función para crear una categoria propia del ecommerce de cotools
 */
function crearCategoria() {

    var grupos = obtenerGruposSeleccionados();
    var descripcion = $('#descripcion').val();

    if(descripcion != ''){
        $.ajax({
            method: "GET",
            url: urlC + "categorias/guardar",
            data: { descripcion: descripcion, grupos: grupos },
            success: function(respuesta) {
                
                // Valida si la respuesta es correcta
                if ( respuesta.estado ) {
                    $('#descripcion').val('');
                    $('.chk-grupos').prop( "checked", false );
                    sweetMessage('success', respuesta.mensaje);
                } else {
                    sweetMessage('warning', respuesta.mensaje);
                }
                
            },
            error: function() {
                var mensaje = 'Se produjo un error. Por favor, inténtelo nuevamente'.
                sweetMessage('error', mensaje);
            }
        });  
    } else {
        var mensaje = 'Debe ingresar la descripción de la categoría.'.
        sweetMessage('success', mensaje);        
    }
}

$( document ).ready(function() {
    obtenerGrupos();    
});