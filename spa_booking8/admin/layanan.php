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

    $id_kategori = $_POST['id_kategori'];
    $nama_layanan = $_POST['nama_layanan'];
    $harga = $_POST['harga'];
    $durasi = $_POST['durasi'];
    $deskripsi = $_POST['deskripsi'];
    $gambar = $_FILES['gambar']['name'];
$tmp = $_FILES['gambar']['tmp_name'];

move_uploaded_file($tmp,"upload/layanan/".$gambar);

    mysqli_query($conn,"
INSERT INTO layanan
(id_kategori,nama_layanan,harga,durasi,deskripsi,gambar)
VALUES
('$id_kategori','$nama_layanan','$harga','$durasi','$deskripsi','$gambar')
");

    header("Location: layanan.php");
    exit;
}

/* UPDATE */
if(isset($_POST['update'])){

    $id_layanan = $_POST['id_layanan'];
    $id_kategori = $_POST['id_kategori'];
    $nama_layanan = $_POST['nama_layanan'];
    $harga = $_POST['harga'];
    $durasi = $_POST['durasi'];
    $deskripsi = $_POST['deskripsi'];

    mysqli_query($conn,"
    UPDATE layanan SET
    id_kategori='$id_kategori',
    nama_layanan='$nama_layanan',
    harga='$harga',
    durasi='$durasi',
    deskripsi='$deskripsi'
    WHERE id_layanan='$id_layanan'
    ");

    header("Location: layanan.php");
    exit;
}

/* HAPUS */
if(isset($_GET['hapus'])){

    $id = $_GET['hapus'];

    mysqli_query($conn,"
    DELETE FROM layanan
    WHERE id_layanan='$id'
    ");

    header("Location: layanan.php");
    exit;
}

/* EDIT */
$edit = null;

if(isset($_GET['edit'])){

    $id = $_GET['edit'];

    $edit = mysqli_fetch_assoc(mysqli_query($conn,"
    SELECT * FROM layanan
    WHERE id_layanan='$id'
    "));
}
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Data Layanan</title>

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

.header{
background:#f4e6d4;
padding:25px;
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
padding:10px 18px;
border-radius:10px;
text-decoration:none;
}

.card{
background:white;
padding:25px;
border-radius:20px;
box-shadow:0 4px 15px rgba(0,0,0,.08);
}

input,
select,
textarea{
width:100%;
padding:12px;
margin-bottom:12px;
border:1px solid #ddd;
border-radius:10px;
}

textarea{
height:90px;
resize:none;
}

button{
background:#b89b72;
color:white;
border:none;
padding:12px 20px;
border-radius:10px;
cursor:pointer;
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
background:#faf5ee;
}

.btn{
    display:inline-block;
    padding:8px 16px;
    text-decoration:none;
    border-radius:8px;
    color:white;
    font-weight:500;
    min-width:70px;
    text-align:center;
}

.edit{
    background:#d4a017;
}

.hapus{
    background:#c0392b;
}

.aksi{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:8px;
}

table th:last-child,
table td:last-child{
    width:180px;
}

</style>

</head>
<body>

<div class="container">

<div class="header">
<h2>🌸 Data Layanan Spa</h2>

<a href="dashboard.php" class="back">
← Dashboard
</a>
</div>

<div class="card">

<h3 style="margin-bottom:15px;color:#6b5b4d;">

<?php if($edit){ ?>
✏️ Edit Layanan
<?php } else { ?>
➕ Tambah Layanan
<?php } ?>

</h3>

<form method="POST" enctype="multipart/form-data">

<?php if($edit){ ?>
<input type="hidden"
name="id_layanan"
value="<?= $edit['id_layanan']; ?>">
<?php } ?>

<select name="id_kategori" required>

<option value="">
-- Pilih Kategori --
</option>

<?php

$kategori = mysqli_query($conn,"
SELECT * FROM kategori
ORDER BY nama_kategori
");

while($k = mysqli_fetch_assoc($kategori)){

$selected = "";

if($edit && $edit['id_kategori']==$k['id_kategori']){
    $selected = "selected";
}

?>

<option
value="<?= $k['id_kategori']; ?>"
<?= $selected; ?>>

<?= $k['nama_kategori']; ?>

</option>

<?php } ?>

</select>

<input
type="text"
name="nama_layanan"
placeholder="Nama Layanan"
value="<?= $edit['nama_layanan'] ?? ''; ?>"
required>

<input
type="number"
name="harga"
placeholder="Harga"
value="<?= $edit['harga'] ?? ''; ?>"
required>

<input
type="text"
name="durasi"
placeholder="Contoh : 60 Menit"
value="<?= $edit['durasi'] ?? ''; ?>"
required>

<textarea
name="deskripsi"
placeholder="Deskripsi Layanan"><?= $edit['deskripsi'] ?? ''; ?></textarea>

<label>Upload Foto Layanan</label>

<input
type="file"
name="gambar"
accept="image/*">

<?php
if($edit && !empty($edit['gambar'])){
?>
<img
src="../upload/layanan/<?= $edit['gambar']; ?>"
width="150"
style="margin-bottom:15px;border-radius:10px;">
<?php } ?>

<?php if($edit){ ?>

<button type="submit" name="update">
Update Layanan
</button>

<?php } else { ?>

<button type="submit" name="simpan">
Simpan Layanan
</button>

<?php } ?>

</form>

<table>

<tr>
<th>No</th>
<th>Foto</th>
<th>Kategori</th>
<th>Nama Layanan</th>
<th>Deskripsi</th>
<th>Harga</th>
<th>Durasi</th>
<th>Aksi</th>
</tr>

<?php

$no = 1;

$data = mysqli_query($conn,"
SELECT layanan.*, kategori.nama_kategori
FROM layanan
JOIN kategori
ON layanan.id_kategori = kategori.id_kategori
ORDER BY layanan.id_layanan DESC
");

while($row = mysqli_fetch_assoc($data)){
?>

<tr>

<td><?= $no++; ?></td>
<td>
<?php if(!empty($row['gambar'])){ ?>
    <img src="upload/layanan/<?= $row['gambar']; ?>"
         width="90"
         height="70"
         style="object-fit:cover;border-radius:10px;">
<?php }else{ ?>
    Tidak ada foto
<?php } ?>
</td>

<td><?= $row['nama_kategori']; ?></td>

<td><?= $row['nama_layanan']; ?></td>
<td style="text-align:left;">
<?= substr($row['deskripsi'],0,60); ?>...
</td>

<td>Rp <?= number_format($row['harga']); ?></td>

<td><?= $row['durasi']; ?></td>

<td>
    <div class="aksi">

        <a href="?edit=<?= $row['id_layanan']; ?>" class="btn edit">
            Edit
        </a>

        <a href="?hapus=<?= $row['id_layanan']; ?>"
           class="btn hapus"
           onclick="return confirm('Yakin ingin menghapus data?')">
            Hapus
        </a>

    </div>
</td>

</tr>

<?php } ?>

</table>

</div>

</div>

</body>
</html>