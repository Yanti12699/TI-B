<?php
include "../config/koneksi.php";

if(session_status() == PHP_SESSION_NONE){
    session_start();
}

if(!isset($_SESSION['id_user'])){
    header("Location: ../login.php");
    exit;
}

$id_user = $_SESSION['id_user'];

$query = mysqli_query($conn,"
SELECT *
FROM booking
WHERE id_user='$id_user'
ORDER BY id_booking DESC
");
?>

<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Booking Spa</title>

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

.kembali{
    display:inline-block;
    margin-bottom:20px;
    padding:10px 20px;
    background:#6B5B4D;
    color:white;
    text-decoration:none;
    border-radius:10px;
}

h1{
    text-align:center;
    color:#6B5B4D;
    margin-bottom:30px;
}

.grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
    gap:20px;
}

.card{
    background:white;
    border-radius:20px;
    overflow:hidden;
    box-shadow:0 4px 15px rgba(0,0,0,.08);
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

.info{
    margin:8px 0;
    color:#555;
}

.status{
    display:inline-block;
    padding:8px 15px;
    border-radius:20px;
    color:white;
    font-size:14px;
    margin-top:10px;
}

.pending{
    background:#f39c12;
}

.proses{
    background:#3498db;
}

.selesai{
    background:#27ae60;
}

</style>

</head>
<body>

<div class="container">

<a href="dashboard.php" class="kembali">
← Kembali
</a>

<h1>Booking Spa Saya</h1>

<div class="grid">

<?php
if(mysqli_num_rows($query) > 0){

while($data = mysqli_fetch_assoc($query)){
?>

<div class="card">

<img src="../assets/booking.jpg" alt="Booking Spa">

<div class="content">

<h3>Booking #<?= $data['id_booking']; ?></h3>

<p class="info">
📅 Tanggal :
<b><?= $data['tanggal']; ?></b>
</p>

<p class="info">
🕒 Jam :
<b><?= $data['jam']; ?></b>
</p>

<p class="info">
📌 Status :
</p>

<span class="status
<?=
$data['status']=='Pending' ? 'pending' :
($data['status']=='Proses' ? 'proses' : 'selesai');
?>
">
<?= $data['status']; ?>
</span>

</div>

</div>

<?php
}
}else{
?>

<div style="
background:white;
padding:30px;
border-radius:20px;
text-align:center;
width:100%;
">
Belum ada data booking spa.
</div>

<?php } ?>

</div>

</div>

</body>
</html>