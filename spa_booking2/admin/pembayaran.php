<?php
include "../config/koneksi.php";

if(!isset($_SESSION['id_user'])){
    header("Location: ../login.php");
    exit;
}

if($_SESSION['role'] != 'admin'){
    header("Location: ../login.php");
    exit;
}

/* SIMPAN */
if(isset($_POST['simpan'])){

    $id_booking = $_POST['id_booking'];
    $metode = $_POST['metode'];
    $jumlah = $_POST['jumlah'];
    $status = $_POST['status'];

    $bukti = "";

    if($_FILES['bukti']['name'] != ""){

        $bukti = time().$_FILES['bukti']['name'];

        move_uploaded_file(
            $_FILES['bukti']['tmp_name'],
            "../assets/bukti/".$bukti
        );
    }

    mysqli_query($conn,"
    INSERT INTO pembayaran
    (id_booking,metode,jumlah,bukti,status)
    VALUES
    ('$id_booking','$metode','$jumlah','$bukti','$status')
    ");

    header("Location: pembayaran.php");
    exit;
}

/* HAPUS */
if(isset($_GET['hapus'])){

    $id = $_GET['hapus'];

    mysqli_query($conn,"
    DELETE FROM pembayaran
    WHERE id_pembayaran='$id'
    ");

    header("Location: pembayaran.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Data Pembayaran</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:'Segoe UI',sans-serif;
}

body{
background:#f8f4ee;
}

.container{
width:90%;
max-width:1200px;
margin:30px auto;
}

.header{
background:linear-gradient(135deg,#e6d3b3,#d9c2a3);
padding:25px;
border-radius:20px;
margin-bottom:20px;
display:flex;
justify-content:space-between;
align-items:center;
}

.header h2{
color:#5d4b3f;
}

.back{
background:#8b7355;
color:white;
padding:10px 18px;
border-radius:10px;
text-decoration:none;
}

.card{
background:white;
padding:25px;
border-radius:20px;
box-shadow:0 5px 15px rgba(0,0,0,.08);
}

input,
select{
width:100%;
padding:12px;
margin-bottom:12px;
border:1px solid #ddd;
border-radius:10px;
}

button{
background:#b89b72;
color:white;
border:none;
padding:12px 20px;
border-radius:10px;
cursor:pointer;
}

button:hover{
background:#a88758;
}

table{
width:100%;
margin-top:20px;
border-collapse:collapse;
}

table th{
background:#b89b72;
color:white;
padding:12px;
}

table td{
padding:12px;
border-bottom:1px solid #eee;
text-align:center;
}

table tr:hover{
background:#faf5ef;
}

.hapus{
background:#dc3545;
padding:8px 14px;
color:white;
text-decoration:none;
border-radius:8px;
}

img{
border-radius:10px;
}

</style>

</head>
<body>

<div class="container">

<div class="header">
<h2>💳 Data Pembayaran</h2>

<a href="dashboard.php" class="back">
← Dashboard
</a>
</div>

<div class="card">

<h3 style="margin-bottom:15px;color:#6b5b4d;">
Tambah Pembayaran
</h3>

<form method="POST" enctype="multipart/form-data">

<select name="id_booking" required>

<option value="">
Pilih Booking
</option>

<?php

$booking = mysqli_query($conn,"
SELECT * FROM booking
");

while($b = mysqli_fetch_assoc($booking)){
?>

<option value="<?= $b['id_booking']; ?>">
Booking #<?= $b['id_booking']; ?>
</option>

<?php } ?>

</select>

<select name="metode" required>
<option value="">Pilih Metode</option>
<option>Transfer Bank</option>
<option>E-Wallet</option>
<option>Cash</option>
</select>

<input
type="number"
name="jumlah"
placeholder="Jumlah Pembayaran"
required>

<input
type="file"
name="bukti">

<select name="status" required>
<option>Pending</option>
<option>Berhasil</option>
<option>Ditolak</option>
</select>

<button type="submit" name="simpan">
Simpan Pembayaran
</button>

</form>

<table>

<tr>
<th>No</th>
<th>ID Booking</th>
<th>Metode</th>
<th>Jumlah</th>
<th>Bukti</th>
<th>Status</th>
<th>Aksi</th>
</tr>

<?php

$no = 1;

$data = mysqli_query($conn,"
SELECT * FROM pembayaran
ORDER BY id_pembayaran DESC
");

while($row = mysqli_fetch_assoc($data)){
?>

<tr>

<td><?= $no++; ?></td>

<td><?= $row['id_booking']; ?></td>

<td><?= $row['metode']; ?></td>

<td>Rp <?= number_format($row['jumlah']); ?></td>

<td>

<?php if($row['bukti']!=""){ ?>

<img
src="../assets/bukti/<?= $row['bukti']; ?>"
width="80">

<?php } ?>

</td>

<td><?= $row['status']; ?></td>

<td>

<a
class="hapus"
href="?hapus=<?= $row['id_pembayaran']; ?>"
onclick="return confirm('Hapus data?')">

Hapus

</a>

</td>

</tr>

<?php } ?>

</table>

</div>

</div>

</body>
</html>