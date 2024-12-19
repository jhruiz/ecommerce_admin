<?php

    // Nombre de carpeta que contendrá las imagenes
    $pkgName = date("YmdHis");
    $uploadFiles = '';

    // Valida si se cargaron bien los archivos
    if(isset($_FILES['myFiles']['name'])) {

        // Crea la carpeta donde iran los archivos (valida que no exista primero)
        if (!file_exists('../../dist/img/' . $pkgName)) {
            mkdir('../../dist/img/' . $pkgName, 0777, true);
        }

        // Recorre los archivos cargados en temporales
        foreach( $_FILES['myFiles']['tmp_name'] as $key => $value ) {

            // Separa el nombre para obtener la extension
            $arrNombre = explode(".", $_FILES['myFiles']['name'][$key]); 

            // Crea el nombre del archivo con la fecha actual, peso del archivo y la extension
            $fileName = date("YmdHis") . $_FILES['myFiles']['size'][$key] . '.' . $arrNombre['1'];

            // Crea la ubicacion lógica del archivo
            $location = '../../dist/img/' . $pkgName . '/' . $fileName;

            // Carga el archivo
            if(move_uploaded_file($_FILES['myFiles']['tmp_name'][$key], $location)) {
                $uploadFiles .= $pkgName . '/' . $fileName . '#';
            } else {
                $uploadFiles .= 'error#';
            }            
        }

        echo $uploadFiles;

    } else {
        echo $uploadFiles;
    }

?>