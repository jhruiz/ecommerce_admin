// var urlC = 'https://cotoolsback.cotools.co/public/';
var urlC = 'http://localhost:85/cotoolsback/public/';

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
 * Funcion para actualizar la categoria
 */
function actualizarCategoria() {

    var grupos = obtenerGruposSeleccionados();
    var descripcion = $('#descripcion').val();
    var categoriaId = $('#categoriaId').val();

    if(descripcion != ''){
        $.ajax({
            method: "GET",
            url: urlC + "categoria/actualizar",
            data: { descripcion: descripcion, grupos: grupos, categoriaId: categoriaId },
            success: function(respuesta) {
                
                // Valida si la respuesta es correcta
                if ( respuesta.estado ) {
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

/**
 * Marca los grupos ya seleccionados para la categoria
 */
var marcarGrupos = function(data) {

    data.forEach(element => {
        $('#grup_' + element.grupo_id).prop( "checked", true );
    });

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
 * Obtiene los grupos asignados a la categoria
 */
var obtenerGruposCategoria = function() {
    var cat = $('#categoriaId').val();
    $.ajax({
        method: "GET",
        url: urlC + "gruposcategorias/obtener",
        data: { categoriaId: cat },
        success: function(respuesta) {

            // Valida si la respuesta es correcta
            if ( respuesta.estado ) {                
                marcarGrupos(respuesta.data);
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
}

/**
 * Obtiene todos los grupos padre registrados en datax
 */
 var obtenerGrupos = function() {

    $.ajax({
        method: "GET",
        url: urlC + "grupos/obtener",
        async: false,
        success: function(respuesta) {
            
            // Valida si la respuesta es 
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
 * Obtener las informacion de la categoria
 */
var obtenerCategoria = function() {
    var cat = $('#categoriaId').val();

    $.ajax({
        method: "GET",
        url: urlC + "categoria/obtener",
        data: { categoriaId: cat },
        success: function(respuesta) {
            // Valida si la respuesta es correcta
            if ( respuesta.estado ) {                
                $('#descripcion').val(respuesta.data['0'].descripcion);
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
    obtenerCategoria();
    obtenerGrupos();  
    obtenerGruposCategoria();  
});