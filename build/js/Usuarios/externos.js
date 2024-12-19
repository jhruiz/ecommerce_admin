/**
 * Setea el div content con el formulario para crear un nuevo usuario
 */
 function nuevoUsuario() {
    $.ajax({
        method: "GET",
        url: '../../pages/usuarios/add.html',

        success: function(respuesta) {
            $('#content-data').html(respuesta);
            setTimeout(function() {
                $('#1').hide();
                $("#1 + label").hide();
                $("#2").prop('checked', true).prop('disabled', true);
            }, 2500)
        },
        error: function() {
            var mensaje = 'Se presentó un error. Por favor, inténtelo mas tarde.';
            sweetMessage('error', mensaje);
        }
      })     
}

$( document ).ready(function() {
    nuevoUsuario();
    $('#content-usuarios').css("margin-top", "300px !important");
});