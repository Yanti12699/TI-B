<?php
include "../config/koneksi.php";
session_start();

$id_user = $_SESSION['id_user'];
$id_layanan = $_GET['id'];

$layanan = mysqli_fetch_assoc(
mysqli_query($conn,"
SELECT * FROM layanan
WHERE id_layanan='$id_layanan'
")
);

if(isset($_POST['booking'])){

$tanggal = $_POST['tanggal'];
$jam = $_POST['jam'];

mysqli_query($conn,"
INSERT INTO booking
(id_user,id_layanan,tanggal,jam,status)
VALUES
('$id_user','$id_layanan','$tanggal','$jam','Menunggu')
");

echo "
<script>
alert('Booking Berhasil');
window.location='riwayat_booking.php';
</script>";
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Form Booking</title>

<style>

body{
background:#F8F4EC;
font-family:Segoe UI;
}

.card{
width:500px;
margin:50px auto;
background:white;
padding:30px;
border-radius:20px;
}

input{
width:100%;
padding:12px;
margin-bottom:15px;
border:1px solid #ddd;
border-radius:10px;
}

button{
background:#B89B72;
color:white;
border:none;
padding:12px 25px;
border-radius:10px;
cursor:pointer;
}

</style>

</head>
<body>

<div class="card">

<h2><?= $layanan['nama_layanan']; ?></h2>

<p>
Rp <?= number_format($layanan['harga']); ?>
</p>

<form method="POST">

<input type="date" name="tanggal" required>

<input type="time" name="jam" required>

<button type="submit" name="booking">
Booking Sekarang
</button>

</form>

</div>

</body>
</html>