// var urlC = 'https://cotoolsback.cotools.co/public/';
var urlC = 'http://localhost:85/cotoolsback/public/';

/**
 * Funcion de login para usuarios administradores
 */
var loginFunction = function() {  

    var user = $('#user').val();
    var password = $('#password').val();
    var type = 'A';
    $.ajax({
        method: "GET",
        url: urlC + "usuario/login",
        data: { user: user, password: password, type: type },
        success: function(respuesta) {
            if ( respuesta.estado ) {

                //Almacena la información del usuario en el local storage
                localStorage.setItem('email', respuesta.data['0'].email);
                localStorage.setItem('id', respuesta.data['0'].id);
                localStorage.setItem('date', new Date());            

                sweetMessage('success', 'login correcto');
                window.location.href = window.location + 'pages/main/main.html';
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
    localStorage.clear();
    $('#make-login').click(loginFunction);
});