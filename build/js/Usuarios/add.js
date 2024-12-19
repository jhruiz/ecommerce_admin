// var urlC = 'https://cotoolsback.cotools.co/public/';
var urlC = 'http://localhost:85/cotoolsback/public/';

//Instancia un arreglo que contendra los nombre de los documentos  
var archivosCli = [];

/**
 * Obtiene el tipo de persona seleccionada para validar la información que requiere
 */
var inputsTipoPersona = function() {
    var val = $('#person-type option:selected').val();
    
    // valida si el tipo de persona seleccionada es natural o juridica
    if ( val == '1' ) {
        $('.j-person').hide();
        $('.n-person').show();
    } else {
        $('.n-person').hide();
        $('.j-person').show();
    }
}

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
 * Obtiene el tipo de personas
 */
 var obtenerTipoPersona = function() {
    $.ajax({
        method: "GET",
        url: urlC + 'tipopersonas/obtener',

        success: function(respuesta) {

            // se crea el html del select
            var tpSel = ''
            respuesta.data.forEach(element => {
                tpSel += '<option value="'+ element.id +'">'+ element.descripcion +'</option>';
            });
            $('#person-type').append(tpSel);            
            $('#person-type').change(inputsTipoPersona);
            
        },
        error: function() {
            var mensaje = 'Se presentó un error. Por favor, inténtelo mas tarde.';
            sweetMessage('error', mensaje);
        }
      });    
}

var obtenerCiudades = function() {
    $.ajax({
        method: "GET",
        url: urlC + 'ciudades/obtener',

        success: function(respuesta) {

            // se crea el html del select
            var cSel = ''
            respuesta.data.forEach(element => {
                cSel += '<option value="'+ element.id +'">'+ element.descripcion +'</option>';
            });
            $('#cities').append(cSel);
            
        },
        error: function() {
            var mensaje = 'Se presentó un error. Por favor, inténtelo mas tarde.';
            sweetMessage('error', mensaje);
        }
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
 * Valida que el archivo cargado sea valido
 * @param {*} datos 
 */
function validarArchivo(datos) {
    
    var dataFI = $('#' + datos.id).prop('files')[0];

    // valida el tamaño del archivo
    if(dataFI.size > 1000000) {
        var mensaje = 'El tamaño máximo del archivo es 1MB.';
        sweetMessage('warning', mensaje);
        $('#' + datos.id).val('');
    }

    // valida el formato del archivo
    if(dataFI.name.split('.')['1'].toLowerCase() != 'pdf') {
        var mensaje = 'Solo se permiten archivos en formato pdf.';
        sweetMessage('warning', mensaje);
        $('#' + datos.id).val('');
    }
    
    
}

/**
 * Genera el html con los perfiles configurados en la base de datos
 */
var crearInputDocumentos = function(data) {
    var htmlDocumentos = '';

    data.forEach(element => {
        htmlDocumentos += '<div class="form-group">';
        htmlDocumentos += '<label for="doc_' + element.id + '">' + element.descripcion + '</label>';
        htmlDocumentos += '<div class="input-group">';
        htmlDocumentos += '<div class="custom-file">';
        htmlDocumentos += '<input id="doc_' + element.id + '" type="file" name="' + element.id + '" class="files-upload" onchange="validarArchivo(this)">';
        htmlDocumentos += '</div></div></div>';
    });

    $('#input-documentos').html(htmlDocumentos);
}

/**
 * Obtiene los perfiles configurados en la aplicación
 */
var obtenerPerfiles = function() {
    $.ajax({
        method: "GET",
        url: urlC + "perfiles/obtener",
        success: function(respuesta) {
            if( respuesta.estado ) {
                crearCheckPerfiles(respuesta.data);
            } else {                
                sweetMessage('warning', respuesta.mensaje); 
            }
        },
        error: function() {
            var mensaje = 'Se presentó un error. Por favor, inténtelo mas tarde.';
            sweetMessage('error', mensaje);
        }
    });    
}

/**
 * Obtener tipos de documentos a cargar
 */
var obtenerDocumentos = function() {
    $.ajax({
        method: "GET",
        url: urlC + "documentos/obtener",
        success: function(respuesta) {

            $('.preloader').hide("slow");

            if( respuesta.estado ) {
                crearInputDocumentos(respuesta.data);
            } else {                
                sweetMessage('warning', respuesta.mensaje); 
            }
        },
        error: function() {
            var mensaje = 'Se presentó un error. Por favor, inténtelo mas tarde.';
            sweetMessage('error', mensaje);
        }
    });     
}

/**
 * Guarda los documentos relacionados a un usuario
 * @param {*} usuarioId 
 */
var crearDocumentoUsuario = function(usuarioId) {
    $.ajax({
        method: "GET",
        url: urlC + "documentosusr/crear",
        data: { usuarioId : usuarioId, documentos : archivosCli },
        success: function(respuesta) {

            if( respuesta.estado ) {
                crearInputDocumentos(respuesta.data);
            } else {                
                sweetMessage('warning', respuesta.mensaje); 
            }
        },
        error: function() {
            var mensaje = 'Se presentó un error. Por favor, inténtelo mas tarde.';
            sweetMessage('error', mensaje);
        }
    });     
}

/**
 * Ajax para cargar los documentos
 */
var cargarArchivos = function() {

    archivosCli = [];

    $('.files-upload').each( function(index,element) {

        // instancia un form data y se le pasa el archivo del input    
        file = $('#' + element.id)['0'].files['0'];
        var form_data = new FormData();
        form_data.append('file', file);

        $.ajax({
            method: "POST",
            url: '../../pages/documentos/cargardocumentos.php',
            data: form_data,
            contentType: false,
            processData: false,
            async: true,
            success: function(respuesta) {

                if(respuesta == '0'){
                    var mensaje = 'No fue posible cargar la imagen.';
                    sweetMessage('warning', mensaje);
                } else {
                    var mensaje = 'Archivo cargado correctamente.';
                    sweetMessage('success', mensaje);

                    var infoArchivo = {
                        'nombre' : respuesta,
                        'id' : element.name
                    }
                    // agrega el archivo cargado al array
                    archivosCli.push(infoArchivo);
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
 * Crea un nuevo usuario
 */
function crearUsuario() {

    var tipoPersona = $('#person-type option:selected').val();
    var nombres =$('#nombre').val();
    var apellidos =$('#apellido').val();
    var razonSocial =$('#razon-social').val();
    var identificacion =$('#identificacion').val();
    var email =$('#email').val();
    var cities =$('#cities option:selected').val();
    var direccion =$('#direccion').val();
    var telefono =$('#telefono').val();
    var celular =$('#celular').val();
    var perfiles = perfilesSeleccionados();

    // carga los archivos
    cargarArchivos();

    $.ajax({
        method: "GET",
        url: urlC + "usuarios/crear",
        data: {
            identificacion: identificacion, 
            email: email,
            ciudad: cities,
            direccion: direccion,
            celular: celular,
            tipoPersona: tipoPersona,
            nombres: nombres, 
            apellidos: apellidos, 
            razonSocial: razonSocial,
            telefono: telefono,
            perfiles: perfiles
        },
        success: function(respuesta) {

            if(respuesta.estado){
                var mensaje = 'Usuario creado de forma correcta.';
                sweetMessage('success', mensaje); 
                
                crearDocumentoUsuario(respuesta.data);
            } else {
                sweetMessage('warning', respuesta.mensaje);                
            }
        },
        error: function() {
            var mensaje = 'Se presentó un error. Por favor, inténtelo mas tarde.';
            sweetMessage('error', mensaje);
        }
    });
}

$( document ).ready(function() {
    // se oculta el campo de persona juridica
    $('.j-person').hide();

    obtenerTipoPersona();
    obtenerCiudades();
    obtenerPerfiles();
    obtenerDocumentos();  
});