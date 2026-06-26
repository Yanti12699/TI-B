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

/* Tambah */
if(isset($_POST['simpan'])){

    $nama_kategori = $_POST['nama_kategori'];

    mysqli_query($conn,"
    INSERT INTO kategori(nama_kategori)
    VALUES('$nama_kategori')
    ");

    header("Location: kategori.php");
    exit;
}

/* Update */
if(isset($_POST['update'])){

    $id_kategori = $_POST['id_kategori'];
    $nama_kategori = $_POST['nama_kategori'];

    mysqli_query($conn,"
    UPDATE kategori
    SET nama_kategori='$nama_kategori'
    WHERE id_kategori='$id_kategori'
    ");

    header("Location: kategori.php");
    exit;
}

/* Hapus */
if(isset($_GET['hapus'])){

    $id = $_GET['hapus'];

    mysqli_query($conn,"
    DELETE FROM kategori
    WHERE id_kategori='$id'
    ");

    header("Location: kategori.php");
    exit;
}

/* Edit */
$edit = null;

if(isset($_GET['edit'])){

    $id = $_GET['edit'];

    $edit = mysqli_fetch_assoc(mysqli_query($conn,"
    SELECT *
    FROM kategori
    WHERE id_kategori='$id'
    "));
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Data Kategori</title>

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

.container{
width:90%;
max-width:1200px;
margin:30px auto;
}

/* HEADER */

.header{
background:#f4e6d4;
padding:25px;
border-radius:20px;
margin-bottom:20px;
display:flex;
justify-content:space-between;
align-items:center;
}

.header h2{
color:#6b5b4d;
}

.back{
background:#8b6f47;
color:white;
padding:10px 18px;
border-radius:10px;
text-decoration:none;
}

/* CARD */

.card{
background:white;
padding:25px;
border-radius:20px;
box-shadow:0 4px 15px rgba(0,0,0,.08);
}

/* FORM */

.form-group{
margin-bottom:15px;
}

input{
width:100%;
padding:12px;
border:1px solid #ddd;
border-radius:10px;
outline:none;
}

input:focus{
border-color:#b89b72;
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
background:#9e835f;
}

/* TABLE */

table{
width:100%;
border-collapse:collapse;
margin-top:25px;
overflow:hidden;
}

table th{
background:#b89b72;
color:white;
padding:14px;
}

table td{
padding:12px;
border-bottom:1px solid #eee;
text-align:center;
}

table tr:hover{
background:#faf5ee;
}

/* BUTTON */

.btn{
padding:8px 15px;
border-radius:8px;
text-decoration:none;
color:white;
font-size:14px;
}

.edit{
background:#d4a017;
}

.hapus{
background:#c0392b;
}

.edit:hover{
background:#b58a0f;
}

.hapus:hover{
background:#a5281b;
}

.title-form{
margin-bottom:15px;
color:#6b5b4d;
}

</style>
</head>
<body>

<div class="container">

<div class="header">

<h2>📂 Data Kategori Spa</h2>

<a href="dashboard.php" class="back">
← Dashboard
</a>

</div>

<div class="card">

<h3 class="title-form">

<?php if($edit){ ?>
✏️ Edit Kategori
<?php } else { ?>
➕ Tambah Kategori
<?php } ?>

</h3>

<form method="POST">

<?php if($edit){ ?>

<input
type="hidden"
name="id_kategori"
value="<?= $edit['id_kategori']; ?>">

<div class="form-group">
<input
type="text"
name="nama_kategori"
value="<?= $edit['nama_kategori']; ?>"
required>
</div>

<button type="submit" name="update">
Update Kategori
</button>

<a href="kategori.php"
style="
text-decoration:none;
background:#999;
color:white;
padding:12px 18px;
border-radius:10px;
margin-left:10px;">
Batal
</a>

<?php } else { ?>

<div class="form-group">
<input
type="text"
name="nama_kategori"
placeholder="Masukkan Nama Kategori"
required>
</div>

<button type="submit" name="simpan">
Simpan Kategori
</button>

<?php } ?>

</form>

<table>

<tr>
<th>No</th>
<th>Nama Kategori</th>
<th>Aksi</th>
</tr>

<?php

$no = 1;

$data = mysqli_query($conn,"
SELECT *
FROM kategori
ORDER BY id_kategori DESC
");

while($row = mysqli_fetch_assoc($data)){

?>

<tr>

<td><?= $no++; ?></td>

<td><?= $row['nama_kategori']; ?></td>

<td>

<a
href="?edit=<?= $row['id_kategori']; ?>"
class="btn edit">
Edit
</a>

<a
href="?hapus=<?= $row['id_kategori']; ?>"
class="btn hapus"
onclick="return confirm('Yakin ingin menghapus data ini?')">
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