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
SELECT booking.*, layanan.nama_layanan
FROM booking
LEFT JOIN layanan
ON booking.id_layanan = layanan.id_layanan
WHERE booking.id_user = '$id_user'
ORDER BY booking.id_booking DESC
");
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Riwayat Booking Spa</title>

<style>

body{
    margin:0;
    font-family:'Segoe UI',sans-serif;
    background:#F8F4EC;
}

.container{
    width:90%;
    max-width:1200px;
    margin:30px auto;
}

.header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:20px;
}

h1{
    color:#6B5B4D;
}

.btn-kembali{
    background:#6B5B4D;
    color:white;
    padding:10px 20px;
    text-decoration:none;
    border-radius:10px;
}

.table-box{
    background:white;
    border-radius:20px;
    overflow:hidden;
    box-shadow:0 3px 10px rgba(0,0,0,.08);
}

table{
    width:100%;
    border-collapse:collapse;
}

th{
    background:#B89B72;
    color:white;
    padding:15px;
}

td{
    padding:15px;
    border-bottom:1px solid #eee;
    text-align:center;
}

tr:hover{
    background:#fafafa;
}

.status{
    padding:6px 12px;
    border-radius:20px;
    color:white;
    font-size:13px;
}

.menunggu{
    background:#f39c12;
}

.diproses{
    background:#3498db;
}

.selesai{
    background:#27ae60;
}

.batal{
    background:#e74c3c;
}

.kosong{
    text-align:center;
    padding:40px;
    color:#888;
}

</style>
</head>

<body>

<div class="container">

<div class="header">
    <h1>Riwayat Booking Spa</h1>

    <a href="dashboard.php" class="btn-kembali">
        ← Kembali
    </a>
</div>

<div class="table-box">

<table>

<tr>
    <th>No</th>
    <th>Layanan</th>
    <th>Tanggal</th>
    <th>Jam</th>
    <th>Status</th>
</tr>

<?php
if(mysqli_num_rows($query) > 0){

$no = 1;

while($row = mysqli_fetch_assoc($query)){

$status = strtolower($row['status']);
?>

<tr>

<td><?= $no++; ?></td>

<td><?= $row['nama_layanan']; ?></td>

<td><?= $row['tanggal']; ?></td>

<td><?= $row['jam']; ?></td>

<td>

<?php if($status == 'menunggu'){ ?>
<span class="status menunggu">Menunggu</span>

<?php } elseif($status == 'diproses'){ ?>
<span class="status diproses">Diproses</span>

<?php } elseif($status == 'selesai'){ ?>
<span class="status selesai">Selesai</span>

<?php } else { ?>
<span class="status batal">Batal</span>
<?php } ?>

</td>

</tr>

<?php
}
}else{
?>

<tr>
<td colspan="5" class="kosong">
Belum ada riwayat booking spa.
</td>
</tr>

<?php } ?>

</table>

</div>

</div>

</body>
</html>