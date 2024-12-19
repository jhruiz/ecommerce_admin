// var urlC = 'https://cotoolsback.cotools.co/public/';
var urlC = 'http://localhost:85/cotoolsback/public/';
var estados = {};
var estadosItems = {};

/**
 * Elimina una imagen específica
 * @param {*} data 
 */
function eliminarImg(data) {
    if (window.confirm("¿Está seguro que desea eliminar la imagen?")) {

        var arrInput = data.id.split('_');

        $.ajax({
            method: "GET",
            url: urlC + "imagenes/eliminar", 
            data: { idImage: arrInput['1'] },
            async: false,
            success: function(respuesta) {       
                // Valida si la respuesta es correcta
                if ( respuesta.estado ) {
                    sweetMessage('success', respuesta.mensaje);
                    $('#dvImg_' + arrInput['1']).fadeOut("normal", function() {
                        $(this).remove();
                    });               
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
}

/**
 * Cambiar posición de la imagen
 */
function cambiarPosicion(data) {
    console.log(data);
}

/**
 * Cambiar el estado del item
 * @param {*} data 
 */
function cambiarEstadoItems(data) {
    var value = $('#' + data.id).val();
    var arrInput = data.id.split('_');

    $.ajax({
        method: "GET",
        url: urlC + "change-state-image", 
        data: { value: value, idImage: arrInput['1'] },
        async: false,
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
}

/**
 * Cambiar el estado de la imagen
 */
function cambiarEstado(data) {
    var value = $('#' + data.id).val();
    var arrInput = data.id.split('_');

    $.ajax({
        method: "GET",
        url: urlC + "change-state", 
        data: { value: value, idImage: arrInput['1'] },
        async: false,
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
}

/**
 * Obtiene los estados
 */
var obtenerEstados = function(){
    
    $.ajax({
        method: "GET",
        url: urlC + "estados/obtener", 
        async: false,
        success: function(respuesta) {       
            // Valida si la respuesta es correcta
            if ( respuesta.estado ) {
                estados = respuesta.data;
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
 * Obtiene los estados para los productos (ribbons)
 */
var obtenerEstadosItems = function() {
    $.ajax({
        method: "GET",
        url: urlC + "estadoitems/obtener", 
        async: false,
        success: function(respuesta) {       
            // Valida si la respuesta es correcta
            if ( respuesta.estado ) {
                estadosItems = respuesta.data;
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
 * Guarda las imagenes cargadas y relacionadas a un item
 */
var guardarArchivosCargados = function(strImagenes) {
    var arrImagenes = strImagenes.split('#');
    var itemId = $('#itemId').val();

    $.ajax({
        method: "GET",
        url: urlC + "imagenes/guardar",
        data: { itemId: itemId, arrImagenes: arrImagenes }, 
        success: function(respuesta) {       
            // Valida si la respuesta es correcta
            if ( respuesta.estado ) {
                sweetMessage('success', respuesta.mensaje);
                obtenerImagenes();
            } else {
                sweetMessage('warning', respuesta.mensaje);
            }
        },
        error: function() {
            var mensaje = 'Se produjo un error. Por favor, inténtelo nuevamente'.
            sweetMessage('error', mensaje);
        }
    });    

    $('#item_imgs').val('');
    
}

/**
 * Valida que todos los archivos cumplan con el formato de imagen
 */
function validarArchivos(datos) {

    var files = $('#' + datos.id)[0].files;

    for(var i = 0; i < files.length; i++){
        var dataFile = $('#' + datos.id).prop('files')[i];

        // valida el formato del archivo
        if(dataFile.name.split('.')['1'].toLowerCase() != 'jpg' && dataFile.name.split('.')['1'].toLowerCase() != 'jpeg') {
            var mensaje = 'Solo se permiten imágenes en formato jpg o jpeg.';
            sweetMessage('warning', mensaje);
            $('#' + datos.id).val('');
            break;
        }
    }
}

/**
 * Ajax para cargar las imagenes
 */
function cargarImagenes() {
    var files = $('#item_imgs')['0'].files;
    var form_data = new FormData();

    for(const file of files) {
        form_data.append('myFiles[]', file);
    }
    
    $.ajax({
        method: "POST",
        url: '../../pages/items/cargarimagenes.php',
        data: form_data,
        contentType: false,
        processData: false,
        async: true,
        success: function(respuesta) {

            if(respuesta == '0'){
                var mensaje = 'No fue posible cargar la imagen.';
                sweetMessage('warning', mensaje);
            } else {
                guardarArchivosCargados(respuesta);
            }
            
        },
        error: function() {
            var mensaje = 'Se presentó un error. Por favor, inténtelo mas tarde.';
            sweetMessage('error', mensaje);
        }
    });      
}

/**
 * Funcion para agregar la nueva palabra clave al GUI
 * @param {*} palabra 
 * @param {*} palabraId 
 */
var agregarNuevaPalabraClave = function(palabra, palabraId) {
    var palabraHtml = '<div class="callout callout-success" id="dvpc_' + palabraId + '">';
    palabraHtml += '<h5>' + palabra;
    palabraHtml += '<div class="float-right">';
    palabraHtml += '<span><i class="fas fa-trash-alt" title="Eliminar Palabra" id="spn_' + palabraId + '" onclick="eliminarPalabraClave(this)"></i></span>';
    palabraHtml += '</div>'; 
    palabraHtml += '</h5></div>';

    $('#newKeyWords').append(palabraHtml);
    $('#descNuevaPalabra').val('');

}

/**
 * Funcion ajax para crear una nueva palabra clave
 */
function agregarPalabraClave() {
    var itemId = $('#itemId').val();
    var palabra = $('#descNuevaPalabra').val();

    if(palabra == ''){
        mensaje = 'Debe ingresar una palabra clave.';
        sweetMessage('warning', mensaje);
    } else {
        $.ajax({
            method: "GET",
            url: urlC + "palabrasclave/guardar",
            data: { itemId: itemId, palabra: palabra }, 
            success: function(respuesta) {       
                // Valida si la respuesta es correcta para mostrar el producto
                if ( respuesta.estado ) {
                    sweetMessage('success', respuesta.mensaje);
                    agregarNuevaPalabraClave(palabra, respuesta.data);
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
}

/**
 * Actualizar el estado de 
 * @param {*} data 
 */
function eliminarPalabraClave(data) {
    if (window.confirm("¿Está seguro que desea eliminar la palabra clave?")) {

        var arrPalabra = data.id.split('_');
        $.ajax({
            method: "GET",
            url: urlC + "palabrasclave/eliminar",
            data: { palabraId: arrPalabra['1'] }, 
            success: function(respuesta) {       
                // Valida si la respuesta es correcta para mostrar el producto
                if ( respuesta.estado ) {
                    sweetMessage('success', respuesta.mensaje);
                    $("#dvpc_" + arrPalabra['1']).hide("slow");
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
}

/**
 * Agrega las palabras claves registradas a la GUI
 * @param {*} data 
 */
var agregarPalabrasClave = function(data) {
    var palabrasHtml = '';
    data.forEach(element => {
        palabrasHtml += '<div class="callout callout-success" id="dvpc_' + element.id + '">';
        palabrasHtml += '<h5>' + element.palabra;
        palabrasHtml += '<div class="float-right">';
        palabrasHtml += '<span><i class="fas fa-trash-alt" title="Eliminar Palabra" id="spn_' + element.id + '" onclick="eliminarPalabraClave(this)"></i></span>';
        palabrasHtml += '</div>'; 
        palabrasHtml += '</h5></div>';
    })

    $('#oldKeyWords').append(palabrasHtml);
    
}

/**
 * Obtiene las palabras clave registradas para el item
 */
var obtenerPalabrasClave = function() {
    var itemId = $('#itemId').val();

    $.ajax({
        method: "GET",
        url: urlC + "palabrasclave/obtener",
        data: { itemId: itemId }, 
        success: function(respuesta) {       
            // Valida si la respuesta es correcta para mostrar el producto
            if ( respuesta.estado ) {
                agregarPalabrasClave(respuesta.data);
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
 * Setea la información obtenida del producto en los inputs del formulario
 * @param {*} data 
 */
var setDatosItem = function(data) {
    console.log(data);
    $('#referencia').val(data['0'].referencia).prop("disabled", true);   
    $('#descripcion').val(data['0'].descripcion).prop("disabled", true);
    $('#grupo').val(data['0'].grp_desc).prop("disabled", true);   
    $('#linea').val(data['0'].ln_desc).prop("disabled", true); 
    $('#saldo').val(data['0'].saldoactual).prop("disabled", true); 
    $('#unidadF').val(data['0'].unidad_factor).prop("disabled", true); 
    $('#keydescription').append(data['0'].descripcion);  
}

/**
 * Agrega las imagenes del item
 */
var agregarImagenesGUI = function(data) {

    var htmlImagenes = '';

    data.forEach( element => {
        // crea el select para los estados
        // var htmlEstados = '<select class="custom-select rounded-0" id="est_' + element.id + '" onchange="cambiarEstado(this)">';        
        // estados.forEach( elEstados => {
        //     var selected = element.estado_id == elEstados.id ? 'selected' : '';
        //     htmlEstados += '<option value="' + elEstados.id + '" ' + selected + '>' + elEstados.descripcion + '</option>'
        // });
        // htmlEstados += '</select>';

        // var htmlEstadosItems = '<select class="custom-select rounded-0" id="estI_' + element.id + '" onchange="cambiarEstadoItems(this)">';
        // estadosItems.forEach( elEstItems => {
        //     var selected = element.estadoitem_id == elEstItems.id ? 'selected' : '';
        //     htmlEstadosItems += '<option value="' + elEstItems.id + '" ' + selected + '>' + elEstItems.descripcion + '</option>'
        // });
        // htmlEstadosItems += '</select>';

        htmlImagenes += '<div class="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column" id="dvImg_' + element.id + '">';
        htmlImagenes += '<div class="card bg-light d-flex flex-fill">';
        htmlImagenes += '<div class="card-header text-muted border-bottom-0">';
        htmlImagenes += '</div>                  ';
        htmlImagenes += '<div class="card-body pt-0">';
        htmlImagenes += '<div class="row">';
        htmlImagenes += '<div class="text-center">';
        htmlImagenes += '<img src="../../dist/img/' + element.url + '" class="img-fluid">';
        htmlImagenes += '</div>';
        htmlImagenes += '</div>';
        htmlImagenes += '</div>';
        htmlImagenes += '<div class="card-footer">';
        htmlImagenes += '<div class="text-right">';
        // htmlImagenes += '<div class="form-group row" style="margin-bottom:5px;">';
        // htmlImagenes += '<div class="col-sm-6">';
        // htmlImagenes += htmlEstados;
        // htmlImagenes += '</div>';
        // htmlImagenes += '<div class="col-sm-6">';
        // htmlImagenes += htmlEstadosItems;
        // htmlImagenes += '</div>';
        // htmlImagenes += '<div class="col-sm-2">';
        // htmlImagenes += '<input type="hidden" class="form-control" id="pos_' + element.id + '" value="' + element.posicion + '" onchange="cambiarPosicion(this)">';
        // htmlImagenes += '</div>';
        // htmlImagenes += '</div>';
        htmlImagenes += '<span>';
        htmlImagenes += '<i class="fas fa-trash-alt" id="elim_' + element.id + '" title="Eliminar imágen" onclick="eliminarImg(this)"></i>';
        htmlImagenes += '</span>';
        htmlImagenes += '</div>';
        htmlImagenes += '</div>';
        htmlImagenes += '</div>';
        htmlImagenes += '</div>';
    });
    
    $('#dv_imagenes').html(htmlImagenes);

}

/**
 * Obtiene las imagenes relacionadas al item
 */
var obtenerImagenes = function() {
    var itemId = $('#itemId').val();

    $.ajax({
        method: "GET",
        url: urlC + "imagenesitem/obtener",
        data: { itemId: itemId }, 
        success: function(respuesta) {
            
            $('.preloader').hide("slow");

            // Valida si la respuesta es correcta para mostrar el producto
            if ( respuesta.estado ) {
                agregarImagenesGUI(respuesta.data);
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
 * Obtiene la información del producto registrado en Datax
 */
var obtenerItem = function() {

    var itemId = $('#itemId').val();
    
    $.ajax({
        method: "GET",
        url: urlC + "item/obtener",
        data: { itemId: itemId }, 
        success: function(respuesta) {    
            // Valida si la respuesta es correcta para mostrar el producto
            if ( respuesta.estado ) {
                setDatosItem(respuesta.data);
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
    obtenerItem();
    obtenerEstados();
    obtenerEstadosItems();
    obtenerPalabrasClave();
    obtenerImagenes();    
});