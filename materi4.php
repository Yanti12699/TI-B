<?php
$username_benar = "yanti";
$password_benar = "12345";

if(isset($_POST['login'])){
    $username = $_POST['username'];
    $password = $_POST['password'];

    if($username == $username_benar && $password == $password_benar){
        echo "Login Berhasil";
    } else {
        echo "Login Gagal";
    }
}
?>

<form method="POST">
    Username : <input type="text" name="username"><br><br>
    Password : <input type="password" name="password"><br><br>
    <input type="submit" name="login" value="Login">
</form>