<?php

    if(isset($_FILES['file']['name'])) {

        $fecha = new DateTime();
        $fileName = date("YmdHis") . $_FILES['file']['size'] . '.pdf';
        $location = '../../docs/assets/guides/' . $fileName;        

        if(move_uploaded_file($_FILES['file']['tmp_name'], $location)) {
            echo $fileName;
        } else {
            echo 0;
        }

    } else {
        echo 0;
    }

?>