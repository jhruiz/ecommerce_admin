var infoMenu = function() {
    let arrMenu = [
        {
            'load' : '../usuarios/index.html',
            'icon' : 'nav-icon fas fa-users',
            'tittle' : 'Usuarios'
        },
        {
            'load' : '../items/index.html',
            'icon' : 'nav-icon fas fa-boxes',
            'tittle' : 'Productos'
        },
        {
            'load' : '../categorias/index.html',
            'icon' : 'nav-icon fas fa-object-group',
            'tittle' : 'Categorias'
        },
        {
            'load' : '../pedidos/index.html',
            'icon' : 'nav-icon fas fa-people-carry',
            'tittle' : 'Pedidos'
        },
        {
            'load' : 'logout',
            'icon' : 'fas fa-power-off',
            'tittle': 'Cerrar sesión'
        }
    ];

    return arrMenu;
};

/**
 * Carga el contenido de la ruta seleccinada en el div dispuesto en la pagina main
 */
var clicMenu = function() {

    var url = $(this).data('load');    
 
    //Valida si la opcion seleccionada es para salir del sistema
    if(url == 'logout'){
        localStorage.clear();
        window.location.href = "http://localhost:85/cotoolsadmfront/";        
    } else {
        $.ajax({
            method: "GET",
            url: url,
            success: function(respuesta) {
                $('#content-data').html(respuesta);         
            },
            error: function() {
                var mensaje = 'Se presentó un error. Por favor, inténtelo mas tarde.';
                sweetMessage('error', mensaje);
            }
          }) 
    }
}

/**
 * Crea el html del menu
 */
var loadPrincipalMenu = function() {
    let menu = infoMenu();
    var htmlMenu = '';

    menu.forEach(element => {
        htmlMenu += '<li class="nav-item">';
        htmlMenu += '<a href="#" class="nav-link load-menu" data-load="' + element.load + '">';
        htmlMenu += '<i class="' + element.icon + '"></i>';
        htmlMenu += '<p>&nbsp; &nbsp;' + element.tittle + '</p>';
        htmlMenu += '</a>';
        htmlMenu += '</li>';
    });

    $('#li-menu').html(htmlMenu);
    $('.load-menu').click(clicMenu);
    
};

$( document ).ready(function() {
    loadPrincipalMenu();    
});