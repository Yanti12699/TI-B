<?php
include "../config/koneksi.php";

if(session_status() == PHP_SESSION_NONE){
    session_start();
}

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

    $nama = mysqli_real_escape_string($conn,$_POST['nama']);
    $jenis_kelamin = mysqli_real_escape_string($conn,$_POST['jenis_kelamin']);
    $pengalaman = mysqli_real_escape_string($conn,$_POST['pengalaman']);
    $status = mysqli_real_escape_string($conn,$_POST['status']);

    $simpan = mysqli_query($conn,"
    INSERT INTO terapis
    (nama,jenis_kelamin,pengalaman,status)
    VALUES
    ('$nama','$jenis_kelamin','$pengalaman','$status')
    ");

    if($simpan){
        echo "<script>
        alert('Data terapis berhasil disimpan');
        window.location='terapis.php';
        </script>";
        exit;
    }else{
        die(mysqli_error($conn));
    }
}

/* HAPUS */
if(isset($_GET['hapus'])){

    $id = $_GET['hapus'];

    mysqli_query($conn,"
    DELETE FROM terapis
    WHERE id_terapis='$id'
    ");

    echo "<script>
    alert('Data berhasil dihapus');
    window.location='terapis.php';
    </script>";
    exit;
}

$data = mysqli_query($conn,"
SELECT *
FROM terapis
ORDER BY id_terapis DESC
");
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Data Terapis Spa</title>

<style>

body{
    background:#faf7f2;
    font-family:'Segoe UI',sans-serif;
}

.container{
    width:90%;
    max-width:1200px;
    margin:30px auto;
}

.header{
    background:#f4e6d4;
    padding:20px;
    border-radius:20px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:20px;
}

.header h2{
    color:#6b5b4d;
}

.back{
    background:#8b6f47;
    color:white;
    padding:10px 20px;
    text-decoration:none;
    border-radius:10px;
}

.card{
    background:white;
    padding:25px;
    border-radius:20px;
    box-shadow:0 4px 15px rgba(0,0,0,.08);
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
    background:#a8895d;
}

table{
    width:100%;
    margin-top:20px;
    border-collapse:collapse;
}

th{
    background:#b89b72;
    color:white;
    padding:12px;
}

td{
    padding:12px;
    border-bottom:1px solid #eee;
    text-align:center;
}

.hapus{
    background:#c0392b;
    color:white;
    padding:8px 15px;
    border-radius:8px;
    text-decoration:none;
}

</style>

</head>
<body>

<div class="container">

<div class="header">

<h2>👩 Data Terapis Spa</h2>

<a href="dashboard.php" class="back">
← Dashboard
</a>

</div>

<div class="card">

<h3>Tambah Terapis</h3>

<form method="POST">

<input
type="text"
name="nama"
placeholder="Nama Terapis"
required>

<select name="jenis_kelamin" required>
<option value="">Pilih Jenis Kelamin</option>
<option value="Laki-laki">Laki-laki</option>
<option value="Perempuan">Perempuan</option>
</select>

<input
type="text"
name="pengalaman"
placeholder="Contoh: 3 Tahun"
required>

<select name="status" required>
<option value="Aktif">Aktif</option>
<option value="Tidak Aktif">Tidak Aktif</option>
</select>

<button type="submit" name="simpan">
Simpan Terapis
</button>

</form>

<table>

<tr>
<th>No</th>
<th>Nama</th>
<th>Jenis Kelamin</th>
<th>Pengalaman</th>
<th>Status</th>
<th>Aksi</th>
</tr>

<?php
$no = 1;

while($row = mysqli_fetch_assoc($data)){
?>

<tr>

<td><?= $no++; ?></td>
<td><?= $row['nama']; ?></td>
<td><?= $row['jenis_kelamin']; ?></td>
<td><?= $row['pengalaman']; ?></td>
<td><?= $row['status']; ?></td>

<td>
<a
href="?hapus=<?= $row['id_terapis']; ?>"
class="hapus"
onclick="return confirm('Yakin ingin menghapus data?')">
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