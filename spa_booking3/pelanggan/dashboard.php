<a href="riwayat_booking.php" class="btn">
    Lihat Riwayat
</a><?php
include "../config/koneksi.php";

if(!isset($_SESSION['id_user'])){
    header("Location: ../login.php");
    exit;
}

if($_SESSION['role'] != 'pelanggan'){
    header("Location: ../login.php");
    exit;
}

date_default_timezone_set('Asia/Jakarta');
?>

<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard Pelanggan</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:'Segoe UI',sans-serif;
}

body{
background:#faf7f2;
}

/* HEADER */

header{
background:#f4e6d4;
padding:20px 8%;
display:flex;
justify-content:space-between;
align-items:center;
}

.logo{
font-size:28px;
font-weight:bold;
color:#8b6f47;
}

.user{
color:#6b5b4d;
font-weight:bold;
}

/* HERO */

.hero{
padding:50px 8%;
display:flex;
justify-content:space-between;
align-items:center;
background:white;
margin:30px auto;
width:90%;
border-radius:25px;
box-shadow:0 3px 15px rgba(0,0,0,.08);
}

.hero-text{
width:50%;
}

.hero-text h1{
font-size:42px;
color:#6b5b4d;
margin-bottom:15px;
}

.hero-text p{
font-size:16px;
color:#666;
line-height:1.7;
margin-bottom:20px;
}

.info{
display:flex;
gap:15px;
}

.info-box{
background:#f4e6d4;
padding:15px;
border-radius:12px;
min-width:150px;
}

.info-box h4{
color:#8b6f47;
margin-bottom:5px;
}

.hero-img{
width:40%;
}

.hero-img img{
width:100%;
border-radius:20px;
}

/* MENU */

.menu{
width:90%;
margin:auto;
display:grid;
grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
gap:20px;
margin-bottom:40px;
}

.card{
background:white;
border-radius:20px;
overflow:hidden;
box-shadow:0 3px 15px rgba(0,0,0,.08);
}

.card img{
width:100%;
height:180px;
object-fit:cover;
}

.card-body{
padding:20px;
}

.card-body h3{
color:#6b5b4d;
margin-bottom:10px;
}

.card-body p{
color:#666;
margin-bottom:15px;
}

.card-body a{
display:inline-block;
padding:10px 20px;
background:#b89b72;
color:white;
text-decoration:none;
border-radius:10px;
}

.logout-btn{
background:#c0392b !important;
}

/* FOOTER */

footer{
background:#f4e6d4;
text-align:center;
padding:20px;
color:#6b5b4d;
margin-top:30px;
}

</style>
</head>
<body>

<header>

<div class="logo">
🌿 Spa Booking
</div>

<div class="user">
<?= $_SESSION['nama']; ?>
</div>

</header>

<div class="hero">

<div class="hero-text">

<h1>Selamat Datang 👋</h1>

<p>
Nikmati layanan spa terbaik dan lakukan booking
langsung dari dashboard pelanggan.
</p>

<div class="info">

<div class="info-box">
<h4>📅 Hari Ini</h4>
<?= date('d F Y'); ?>
</div>

<div class="info-box">
<h4>🕒 Jam</h4>
<?= date('H:i'); ?>
</div>

</div>

</div>

<div class="hero-img">

<img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874">

</div>

</div>

<div class="menu">

<div class="card">

<img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15">

<div class="card-body">

<h3>Daftar Layanan</h3>

<p>
Lihat semua layanan spa yang tersedia.
</p>

<a href="layanan.php">
Lihat Layanan
</a>

</div>

</div>

<div class="card">

<img src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd">

<div class="card-body">

<h3>Booking Spa</h3>

<p>
Pesan layanan spa favorit Anda.
</p>

<a href="booking.php">
Booking Sekarang
</a>

</div>

</div>

<div class="card">

<img src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1">

<div class="card-body">

<h3>Riwayat Booking</h3>

<p>
Lihat semua riwayat pemesanan Anda.
</p>

<a href="riwayat.php">
Lihat Riwayat
</a>

</div>

</div>

<div class="card">

<img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15">

<div class="card-body">

<h3>Logout</h3>

<p>
Keluar dari akun pelanggan.
</p>

<a href="../logout.php" class="logout-btn">
Logout
</a>

</div>

</div>

</div>

<footer>

© 2025 Spa Booking System

</footer>

</body>
</html>