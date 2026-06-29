<?php
include "../config/koneksi.php";

if(session_status() == PHP_SESSION_NONE){
    session_start();
}

if(!isset($_SESSION['id_user'])){
    header("Location: ../login.php");
    exit;
}

$query = mysqli_query($conn,"
SELECT
booking.*,
users.nama,
layanan.nama_layanan
FROM booking
JOIN users
ON booking.id_user = users.id_user
JOIN layanan
ON booking.id_layanan = layanan.id_layanan
ORDER BY booking.id_booking DESC
");

if(!$query){
    die("Error Query : " . mysqli_error($conn));
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Data Booking</title>

<style>

body{
    background:#F8F4EC;
    font-family:'Segoe UI',sans-serif;
    margin:0;
}

.container{
    width:95%;
    max-width:1300px;
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
}

table{
    width:100%;
    border-collapse:collapse;
    background:white;
    margin-top:20px;
}

table th{
    background:#6B5B4D;
    color:white;
    padding:12px;
}

table td{
    padding:12px;
    border:1px solid #ddd;
    text-align:center;
}

.pending{
    color:#f39c12;
    font-weight:bold;
}

.konfirmasi{
    color:#3498db;
    font-weight:bold;
}

.selesai{
    color:#27ae60;
    font-weight:bold;
}

.batal{
    color:#e74c3c;
    font-weight:bold;
}

.btn{
    text-decoration:none;
    color:white;
    padding:7px 12px;
    border-radius:5px;
    margin:2px;
    display:inline-block;
}

.btn-konfirmasi{
    background:#3498db;
}

.btn-selesai{
    background:#27ae60;
}

.btn-batal{
    background:#e74c3c;
}

</style>

</head>
<body>

<div class="container">

<a href="dashboard.php" class="kembali">
← Kembali Dashboard
</a>

<h1>Data Booking Pelanggan</h1>

<table>

<tr>
    <th>ID</th>
    <th>Nama Pelanggan</th>
    <th>Layanan</th>
    <th>Tanggal</th>
    <th>Jam</th>
    <th>Status</th>
    <th>Aksi</th>
</tr>

<?php
while($data = mysqli_fetch_assoc($query)){

$statusClass = '';

if($data['status'] == 'Pending'){
    $statusClass = 'pending';
}elseif($data['status'] == 'Dikonfirmasi'){
    $statusClass = 'konfirmasi';
}elseif($data['status'] == 'Selesai'){
    $statusClass = 'selesai';
}else{
    $statusClass = 'batal';
}
?>

<tr>

<td><?= $data['id_booking']; ?></td>

<td><?= $data['nama']; ?></td>

<td><?= $data['nama_layanan']; ?></td>

<td><?= $data['tanggal']; ?></td>

<td><?= $data['jam']; ?></td>

<td class="<?= $statusClass; ?>">
<?= $data['status']; ?>
</td>

<td>

<a class="btn btn-konfirmasi"
href="konfirmasi_booking.php?id=<?= $data['id_booking']; ?>">
Konfirmasi
</a>

<a class="btn btn-selesai"
href="selesai_booking.php?id=<?= $data['id_booking']; ?>">
Selesai
</a>

<a class="btn btn-batal"
href="batal_booking.php?id=<?= $data['id_booking']; ?>">
Batal
</a>

</td>

</tr>

<?php } ?>

</table>

</div>

</body>
</html>