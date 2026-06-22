<?php
include "../config/koneksi.php";

if(session_status() == PHP_SESSION_NONE){
    session_start();
}

if(!isset($_SESSION['id_user'])){
    header("Location: ../login.php");
    exit;
}

$layanan = mysqli_query($conn,"SELECT * FROM layanan");
?>

<!DOCTYPE html>
<html>
<head>
<title>Booking Spa</title>

<style>

body{
background:#F8F4EC;
font-family:Segoe UI;
margin:0;
}

.container{
width:90%;
max-width:1200px;
margin:30px auto;
}

h1{
text-align:center;
color:#6B5B4D;
margin-bottom:30px;
}

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
gap:20px;
}

.card{
background:white;
border-radius:20px;
overflow:hidden;
box-shadow:0 3px 10px rgba(0,0,0,.1);
}

.card img{
width:100%;
height:220px;
object-fit:cover;
}

.content{
padding:20px;
}

.btn{
display:inline-block;
padding:10px 20px;
background:#B89B72;
color:white;
text-decoration:none;
border-radius:10px;
margin-top:15px;
}

</style>

</head>
<body>

<div class="container">

<h1>Booking Spa</h1>

<div class="grid">

<?php while($row=mysqli_fetch_assoc($layanan)){ ?>

<div class="card">

<img src="../assets/layanan.jpg">

<div class="content">

<h3><?= $row['nama_layanan']; ?></h3>

<p><?= $row['deskripsi']; ?></p>

<h3 style="color:#B89B72;">
Rp <?= number_format($row['harga']); ?>
</h3>

<a href="form_booking.php?id=<?= $row['id_layanan']; ?>" class="btn">
Booking Sekarang
</a>

</div>

</div>

<?php } ?>

</div>

</div>

</body>
</html>