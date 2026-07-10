<?php
include "../config/koneksi.php";

if(!isset($_SESSION['id_user'])){
    header("Location: ../login.php");
    exit;
}

$nama = $_SESSION['nama'];

date_default_timezone_set('Asia/Jakarta');
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Dashboard Admin Spa</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:'Segoe UI',sans-serif;
}

body{
background:#F8F4EC;
}

/* HEADER */

.header{
background:linear-gradient(135deg,#E8DCCB,#DCC8AE);
padding:20px 40px;
display:flex;
justify-content:space-between;
align-items:center;
box-shadow:0 2px 10px rgba(0,0,0,.08);
}

.logo{
display:flex;
align-items:center;
gap:15px;
}

.logo-icon{
width:60px;
height:60px;
background:white;
border-radius:50%;
display:flex;
justify-content:center;
align-items:center;
font-size:28px;
}

.logo h1{
font-size:24px;
color:#6B5B4D;
}

.logo p{
font-size:14px;
color:#7B6A58;
}

.profile{
display:flex;
align-items:center;
gap:10px;
}

.profile img{
width:50px;
height:50px;
border-radius:50%;
}

.profile h3{
font-size:16px;
color:#6B5B4D;
}

.container{
width:90%;
max-width:1100px;
margin:25px auto;
}

/* HERO */

.hero{
background:white;
border-radius:20px;
overflow:hidden;
display:flex;
box-shadow:0 3px 12px rgba(0,0,0,.08);
margin-bottom:20px;
}

.hero-left{
flex:1;
padding:30px;
}

.hero-left h4{
color:#B89B72;
margin-bottom:10px;
}

.hero-left h1{
font-size:34px;
color:#4D4035;
margin-bottom:10px;
}

.hero-left p{
font-size:15px;
line-height:1.6;
color:#666;
margin-bottom:20px;
}

.info{
display:flex;
gap:15px;
}

.info-box{
background:#F8F4EC;
padding:12px;
border-radius:12px;
min-width:150px;
}

.info-box h3{
font-size:15px;
color:#B89B72;
margin-bottom:5px;
}

.hero-right{
flex:1;
}

.hero-right img{
width:100%;
height:100%;
object-fit:cover;
}

/* MENU */

.card{
background:white;
border-radius:18px;
padding:18px 22px;
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:15px;
box-shadow:0 2px 8px rgba(0,0,0,.06);
}

.left{
display:flex;
align-items:center;
gap:15px;
}

.icon{
width:60px;
height:60px;
border-radius:15px;
display:flex;
justify-content:center;
align-items:center;
font-size:26px;
background:#F8F4EC;
}

.text h2{
font-size:20px;
color:#4D4035;
margin-bottom:4px;
}

.text p{
font-size:14px;
color:#777;
}

.btn{
width:45px;
height:45px;
border-radius:50%;
background:#B89B72;
color:white;
text-decoration:none;
display:flex;
justify-content:center;
align-items:center;
font-size:24px;
font-weight:bold;
}

.footer{
text-align:center;
padding:25px;
color:#7B6A58;
font-size:14px;
}

</style>

</head>
<body>

<div class="header">

<div class="logo">
<div class="logo-icon">🌿</div>
<div>
<h1>Spa Booking</h1>
<p>Dashboard Admin</p>
</div>
</div>

<div class="profile">
<img src="../assets/admin.jpg">
<div>
<h3><?= $nama ?></h3>
<p>Admin yanti</p>
</div>
</div>

</div>

<div class="container">

<div class="hero">

<div class="hero-left">

<h4>Selamat Datang</h4>

<h1><?= $nama ?> 👋</h1>

<p>
Kelola layanan spa, terapis, booking,
dan pembayaran dalam satu dashboard.
</p>

<div class="info">

<div class="info-box">
<h3>📅 Hari Ini</h3>
<?= date('d F Y'); ?>
</div>

<div class="info-box">
<h3>🕒 Waktu</h3>
<?= date('H:i'); ?>
</div>

</div>

</div>

<div class="hero-right">
<img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874">
</div>

</div>

<div class="card">
<div class="left">
<div class="icon">📂</div>
<div class="text">
<h2>Kategori</h2>
<p>Kelola kategori layanan spa</p>
</div>
</div>
<a href="kategori.php" class="btn">›</a>
</div>

<div class="card">
<div class="left">
<div class="icon">🌸</div>
<div class="text">
<h2>Layanan</h2>
<p>Kelola layanan spa</p>
</div>
</div>
<a href="layanan.php" class="btn">›</a>
</div>

<div class="card">
<div class="left">
<div class="icon">👩</div>
<div class="text">
<h2>Terapis</h2>
<p>Kelola data terapis</p>
</div>
</div>
<a href="terapis.php" class="btn">›</a>
</div>

<div class="card">
<div class="left">
<div class="icon">📅</div>
<div class="text">
<h2>Booking</h2>
<p>Kelola booking pelanggan</p>
</div>
</div>
<a href="booking.php" class="btn">›</a>
</div>

<div class="card">
<div class="left">
<div class="icon">💳</div>
<div class="text">
<h2>Pembayaran</h2>
<p>Kelola pembayaran</p>
</div>
</div>
<a href="pembayaran.php" class="btn">›</a>
</div>

<div class="card">
<div class="left">
<div class="icon">🚪</div>
<div class="text">
<h2>Logout</h2>
<p>Keluar dari sistem</p>
</div>
</div>
<a href="../logout.php" class="btn">›</a>
</div>

</div>

<div class="footer">
© 2025 Spa Booking System
</div>

</body>
</html>