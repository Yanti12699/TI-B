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
    die("ID Booking tidak ditemukan");
}

$id_booking = $_GET['id'];

$query = mysqli_query($conn,"
SELECT booking.*, layanan.nama_layanan
FROM booking
JOIN layanan
ON booking.id_layanan = layanan.id_layanan
WHERE booking.id_booking='$id_booking'
");

$data = mysqli_fetch_assoc($query);

if(!$data){
    die("Data booking tidak ditemukan");
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pembayaran Spa</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:'Segoe UI',sans-serif;
}

body{
    background:#F8F4EC;
    padding:30px;
}

.container{
    max-width:900px;
    margin:auto;
}

.kembali{
    display:inline-block;
    background:#6B5B4D;
    color:white;
    text-decoration:none;
    padding:10px 20px;
    border-radius:10px;
    margin-bottom:20px;
}

.card{
    background:white;
    border-radius:25px;
    overflow:hidden;
    box-shadow:0 5px 20px rgba(0,0,0,.1);
}

.header{
    background:#B89B72;
    color:white;
    text-align:center;
    padding:30px;
}

.content{
    padding:30px;
}

.detail{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:20px;
    margin-bottom:25px;
}

.box{
    background:#FAF7F1;
    padding:20px;
    border-radius:15px;
}

.box h4{
    color:#6B5B4D;
    margin-bottom:10px;
}

.box p{
    color:#555;
}

.total{
    background:#FFF8EB;
    text-align:center;
    padding:25px;
    border:2px dashed #B89B72;
    border-radius:15px;
    margin-bottom:25px;
}

.total h2{
    color:#B89B72;
    font-size:35px;
}

.payment-info{
    background:#F7F3EC;
    padding:20px;
    border-radius:15px;
    margin-bottom:25px;
}

.payment-info h3{
    color:#6B5B4D;
    margin-bottom:15px;
}

.payment-info p{
    margin-bottom:10px;
}

label{
    display:block;
    margin-bottom:8px;
    color:#6B5B4D;
    font-weight:bold;
}

select,
input[type=file]{
    width:100%;
    padding:12px;
    border:1px solid #ddd;
    border-radius:10px;
    margin-bottom:20px;
}

button{
    width:100%;
    background:#B89B72;
    color:white;
    border:none;
    padding:15px;
    border-radius:10px;
    font-size:16px;
    cursor:pointer;
}

button:hover{
    background:#9E825D;
}

@media(max-width:768px){
    .detail{
        grid-template-columns:1fr;
    }
}

</style>

</head>
<body>

<div class="container">

<a href="riwayat_booking.php" class="kembali">
← Kembali
</a>

<div class="card">

<div class="header">
<h1>Pembayaran Booking Spa</h1>
</div>

<div class="content">

<div class="detail">

<div class="box">
<h4>Layanan</h4>
<p><?= $data['nama_layanan']; ?></p>
</div>

<div class="box">
<h4>Status</h4>
<p><?= $data['status']; ?></p>
</div>

<div class="box">
<h4>Tanggal</h4>
<p><?= $data['tanggal']; ?></p>
</div>

<div class="box">
<h4>Jam</h4>
<p><?= $data['jam']; ?></p>
</div>

</div>

<div class="total">
<p>Total Pembayaran</p>
<h2>
Rp <?= number_format($data['total'],0,',','.'); ?>
</h2>
</div>

<div class="payment-info">

<h3>Metode Pembayaran</h3>

<p><b>BCA :</b> 1234567890</p>
<p><b>DANA :</b> 081234567890</p>
<p><b>OVO :</b> 081234567890</p>
<p><b>GoPay :</b> 081234567890</p>
<p><b>QRIS :</b> Scan QR Admin</p>

</div>

<form action="proses_pembayaran.php" method="POST" enctype="multipart/form-data">

<input
type="hidden"
name="id_booking"
value="<?= $data['id_booking']; ?>">

<label>Pilih Pembayaran</label>

<select name="metode_bayar" required>
<option value="">-- Pilih Pembayaran --</option>
<option value="Cash">Cash</option>
<option value="Transfer Bank">Transfer Bank</option>
<option value="Dana">Dana</option>
<option value="OVO">OVO</option>
<option value="GoPay">GoPay</option>
<option value="QRIS">QRIS</option>
</select>

<label>Upload Bukti Pembayaran</label>

<input type="file" name="bukti">

<button type="submit">
Bayar Sekarang
</button>

</form>

</div>

</div>

</div>

</body>
</html>