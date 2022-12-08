<?php
if (isset($_GET["teacher"]) && isset($_GET["puzzle"])) {
    $html = file_get_contents("sign-in.html");
    $html = str_replace("***TEACHERNAME***", $_GET["teacher"], $html);
    $html = str_replace("***PUZZLEID***", $_GET["puzzle"], $html);
    echo $html;
}
else {
    header("location: index.html");
    exit();
}
?>