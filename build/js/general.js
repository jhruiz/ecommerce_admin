var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});


var sweetMessage = function(icono, mensaje){
    Toast.fire({
        icon: icono,
        title: mensaje
    })
}

// Constante para formatear numeros
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });

/**
 * Formatea un numero
 * @param {*} number 
 * @returns 
 */
var numberFormater = function(number) {
    return formatter.format(number).toString();
}

var validarLogin = function() {
    //Valida el estado de login de un usuario
}