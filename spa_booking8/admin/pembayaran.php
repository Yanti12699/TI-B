<?php
include "../config/koneksi.php";

$data = mysqli_query($conn,"
SELECT
pembayaran.*,
users.nama,
layanan.nama_layanan
FROM pembayaran

JOIN users
ON pembayaran.id_user = users.id_user

JOIN layanan
ON pembayaran.id_layanan = layanan.id_layanan
");

if(!$data){
    die(mysqli_error($conn));
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Verifikasi Pembayaran</title>

<style>
body{
    font-family:Segoe UI,sans-serif;
    background:#F8F4EC;
    margin:0;
    padding:30px;
}

h2{
    color:#6B5B4D;
}

table{
    width:100%;
    border-collapse:collapse;
    background:#fff;
}

th,td{
    border:1px solid #ddd;
    padding:10px;
    text-align:center;
}

th{
    background:#6B5B4D;
    color:#fff;
}

.btn{
    text-decoration:none;
    color:#fff;
    padding:6px 12px;
    border-radius:5px;
}

.verif{
    background:#27ae60;
}

.tolak{
    background:#e74c3c;
}
</style>

</head>
<body>

<h2>Verifikasi Pembayaran</h2>

<table>

<tr>
<th>Pelanggan</th>
<th>Layanan</th>
<th>Total Bayar</th>
<th>Tanggal Bayar</th>
<th>Status</th>
<th>Aksi</th>
</tr>

<?php
if(mysqli_num_rows($data)>0){

while($d=mysqli_fetch_assoc($data)){
?>

<tr>

<td><?= $d['nama']; ?></td>

<td><?= $d['nama_layanan']; ?></td>

<td>Rp <?= number_format($d['total_bayar'],0,',','.'); ?></td>

<td><?= $d['tanggal_bayar']; ?></td>

<td><?= $d['status_pembayaran']; ?></td>

<td>

<a class="btn verif"
href="verifikasi.php?id=<?= $d['id_pembayaran']; ?>">
Verifikasi
</a>

<a class="btn tolak"
href="tolak.php?id=<?= $d['id_pembayaran']; ?>">
Tolak
</a>

</td>

</tr>

<?php
}
}else{
?>

<tr>
<td colspan="6">Belum ada data pembayaran.</td>
</tr>

<?php } ?>

</table>

</body>
</html>