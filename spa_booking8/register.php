<?php
include "config/koneksi.php";

if(isset($_POST['register'])){

    $nama = $_POST['nama'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $no_hp = $_POST['no_hp'];
    $alamat = $_POST['alamat'];

    $cek = mysqli_query($conn,"
    SELECT * FROM users
    WHERE email='$email'
    ");

    if(mysqli_num_rows($cek) > 0){

        $error = "Email sudah digunakan!";

    }else{

        mysqli_query($conn,"
        INSERT INTO users
        (nama,email,password,no_hp,alamat,role)
        VALUES
        ('$nama','$email','$password','$no_hp','$alamat','pelanggan')
        ");

        header("Location: login.php");
        exit;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Register Spa Booking</title>

<style>

body{
    font-family:Arial,sans-serif;
    background:#f4f6f9;
}

.container{
    width:450px;
    margin:50px auto;
}

.card{
    background:white;
    padding:25px;
    border-radius:10px;
    box-shadow:0 2px 10px rgba(0,0,0,0.1);
}

h2{
    text-align:center;
    margin-bottom:20px;
}

input, textarea{
    width:100%;
    padding:10px;
    margin:8px 0;
    box-sizing:border-box;
}

textarea{
    height:80px;
}

button{
    width:100%;
    padding:10px;
    border:none;
    background:#28a745;
    color:white;
    border-radius:5px;
    cursor:pointer;
}

.error{
    color:red;
    text-align:center;
    margin-bottom:10px;
}

.login{
    text-align:center;
    margin-top:15px;
}

.login a{
    text-decoration:none;
}

</style>

</head>
<body>

<div class="container">

<div class="card">

<h2>Register Spa Booking</h2>

<?php
if(isset($error)){
    echo "<p class='error'>$error</p>";
}
?>

<form method="POST">

<input
type="text"
name="nama"
placeholder="Nama Lengkap"
required>

<input
type="email"
name="email"
placeholder="Email"
required>

<input
type="password"
name="password"
placeholder="Password"
required>

<input
type="text"
name="no_hp"
placeholder="Nomor HP"
required>

<textarea
name="alamat"
placeholder="Alamat"
required></textarea>

<button
type="submit"
name="register">
Daftar
</button>

</form>

<div class="login">
Sudah punya akun?
<a href="login.php">Login</a>
</div>

</div>

</div>

</body>
</html>