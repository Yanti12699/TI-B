<?php
include "../config/koneksi.php";

if(session_status() == PHP_SESSION_NONE){
    session_start();
}

if(!isset($_SESSION['id_user'])){
    header("Location: ../login.php");
    exit;
}

$data = mysqli_query($conn,"
SELECT layanan.*, kategori.nama_kategori
FROM layanan
LEFT JOIN kategori ON layanan.id_kategori = kategori.id_kategori
ORDER BY layanan.id_layanan DESC
");
?>

<!DOCTYPE html>
<html>
<head>
<title>Daftar Layanan Spa</title>

<style>

body{
    background:#F8F4EC;
    font-family:'Segoe UI',sans-serif;
    margin:0;
}

.container{
    width:90%;
    max-width:1200px;
    margin:30px auto;
}

h1{
    color:#6B5B4D;
    text-align:center;
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

.content h3{
    color:#6B5B4D;
    margin-bottom:10px;
}

.harga{
    color:#B89B72;
    font-weight:bold;
    font-size:18px;
    margin-top:10px;
}

.btn{
    display:inline-block;
    margin-top:15px;
    padding:10px 20px;
    background:#B89B72;
    color:white;
    text-decoration:none;
    border-radius:10px;
}

.btn:hover{
    background:#9b805e;
}

.kembali{
    display:inline-block;
    margin-bottom:20px;
    padding:10px 20px;
    background:#6B5B4D;
    color:white;
    text-decoration:none;
    border-radius:10px;
}

</style>
</head>

<body>

<div class="container">

<a href="dashboard.php" class="kembali">← Kembali</a>

<h1>Daftar Layanan Spa</h1>

<div class="grid">

<?php
if(mysqli_num_rows($data) > 0){
    while($row=mysqli_fetch_assoc($data)){
?>

<div class="card">

<img src="../assets/layanan.jpg" alt="Layanan Spa">

<div class="content">

<h3><?= $row['nama_layanan']; ?></h3>

<p>
Kategori :
<b><?= $row['nama_kategori']; ?></b>
</p>

<p><?= $row['deskripsi']; ?></p>

<div class="harga">
Rp <?= number_format($row['harga'],0,',','.'); ?>
</div>

<a href="booking.php?id=<?= $row['id_layanan']; ?>" class="btn">
Booking Sekarang
</a>

</div>

</div>

<?php
    }
}else{
    echo "<h3>Belum ada layanan spa.</h3>";
}
?>

</div>

</div>

</body>
</html>