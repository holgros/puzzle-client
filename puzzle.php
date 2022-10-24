<?php
    $html = file_get_contents("puzzle.html");
    if (isset($_GET["student"])) {
        $html = str_replace("***PLAYERNAME***", $_GET["student"], $html);
    }
    if (isset($_GET["teacher"]) && isset($_GET["puzzle"])) {
        //$url = "https://peaceful-sands-97012.herokuapp.com/puzzles?user=" . $_GET["teacher"] . "&title=" . $_GET["puzzle"];
        $url = "https://peaceful-sands-97012.herokuapp.com/puzzles";
        //echo $url;
        
        $curl = curl_init();

        curl_setopt_array($curl, array(
          CURLOPT_URL => $url,
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_TIMEOUT => 30,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => "GET",
          CURLOPT_HTTPHEADER => array(
            "cache-control: no-cache"
          ),
        ));
        
        $response = curl_exec($curl);
        $err = curl_error($curl);
        
        curl_close($curl);
        
        //echo $response;
        $response = json_decode($response, true); //because of true, it's in an array
        
        $length = count($response);
        $title = $_GET["puzzle"];
        $creator = $_GET["teacher"];
        for ($i=0; $i < $length; $i++) {
            if ($response[$i]["title"] == $title && $response[$i]["creator"]) {
                //echo $response[$i]["_id"];
                $html = str_replace("***PUZZLEID***", $response[$i]["_id"], $html);
            }
        }
        echo $html;
    }
    else {
        header("location: index.html");
        exit();
    }
?>