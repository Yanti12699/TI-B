<?php
include "../config/koneksi.php";

if(session_status() == PHP_SESSION_NONE){
    session_start();
}

if(!isset($_SESSION['id_user'])){
    header("Location: ../login.php");
    exit;
}

if(!isset($_GET['id'])){
    header("Location: layanan.php");
    exit;
}

$id_user = $_SESSION['id_user'];
$id_layanan = $_GET['id'];

$query = mysqli_query($conn,"
SELECT * FROM layanan
WHERE id_layanan='$id_layanan'
");

$layanan = mysqli_fetch_assoc($query);

if(!$layanan){
    echo "Data layanan tidak ditemukan.";
    exit;
}

if(isset($_POST['booking'])){

    $tanggal = $_POST['tanggal'];
    $jam     = $_POST['jam'];

    mysqli_query($conn,"
    INSERT INTO booking
    (id_user,id_layanan,tanggal,jam,status)
    VALUES
    ('$id_user','$id_layanan','$tanggal','$jam','Menunggu')
    ");

    echo "
    <script>
    alert('Booking berhasil dibuat');
    window.location='riwayat_booking.php';
    </script>
    ";
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Booking Spa</title>

<style>

body{
    background:#F8F4EC;
    font-family:'Segoe UI',sans-serif;
    margin:0;
}

.container{
    width:90%;
    max-width:700px;
    margin:40px auto;
}

.kembali{
    display:inline-block;
    margin-bottom:20px;
    background:#6B5B4D;
    color:white;
    padding:10px 20px;
    text-decoration:none;
    border-radius:10px;
}

.card{
    background:white;
    border-radius:20px;
    overflow:hidden;
    box-shadow:0 4px 15px rgba(0,0,0,.08);
}

.card img{
    width:100%;
    height:250px;
    object-fit:cover;
}

.content{
    padding:25px;
}

h2{
    color:#6B5B4D;
    margin-bottom:10px;
}

.harga{
    color:#B89B72;
    font-size:22px;
    font-weight:bold;
    margin-bottom:20px;
}

.deskripsi{
    color:#666;
    margin-bottom:20px;
}

label{
    display:block;
    margin-bottom:5px;
    color:#6B5B4D;
    font-weight:600;
}

input{
    width:100%;
    padding:12px;
    margin-bottom:15px;
    border:1px solid #ddd;
    border-radius:10px;
    box-sizing:border-box;
}

button{
    width:100%;
    padding:14px;
    background:#B89B72;
    color:white;
    border:none;
    border-radius:10px;
    font-size:16px;
    cursor:pointer;
}

button:hover{
    background:#9f825c;
}

</style>

</head>
<body>

<div class="container">

<a href="layanan.php" class="kembali">
← Kembali ke Layanan
</a>

<div class="card">

<img src="../assets/booking.jpg" alt="Booking Spa">

<div class="content">

<h2><?= $layanan['nama_layanan']; ?></h2>

<div class="harga">
Rp <?= number_format($layanan['harga'],0,',','.'); ?>
</div>

<p class="deskripsi">
<?= $layanan['deskripsi']; ?>
</p>

<form method="POST">

<label>Tanggal Booking</label>
<input type="date" name="tanggal" required>

<label>Jam Booking</label>
<input type="time" name="jam" required>

<button type="submit" name="booking">
Booking Sekarang
</button>

</form>

</div>

</div>

</div>

</body>
</html>