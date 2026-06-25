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

    $nama_terapis  = mysqli_real_escape_string($conn,$_POST['nama_terapis']);
    $jenis_kelamin = mysqli_real_escape_string($conn,$_POST['jenis_kelamin']);
    $no_hp         = mysqli_real_escape_string($conn,$_POST['no_hp']);
    $alamat        = mysqli_real_escape_string($conn,$_POST['alamat']);

    $simpan = mysqli_query($conn,"
    INSERT INTO terapis
    (nama_terapis,jenis_kelamin,no_hp,alamat)
    VALUES
    ('$nama_terapis','$jenis_kelamin','$no_hp','$alamat')
    ");

    if($simpan){
        echo "<script>
        alert('Data terapis berhasil disimpan');
        window.location='terapis.php';
        </script>";
        exit;
    }else{
        die("Gagal menyimpan data : ".mysqli_error($conn));
    }
}

/* UPDATE */
if(isset($_POST['update'])){

    $id_terapis    = $_POST['id_terapis'];
    $nama_terapis  = mysqli_real_escape_string($conn,$_POST['nama_terapis']);
    $jenis_kelamin = mysqli_real_escape_string($conn,$_POST['jenis_kelamin']);
    $no_hp         = mysqli_real_escape_string($conn,$_POST['no_hp']);
    $alamat        = mysqli_real_escape_string($conn,$_POST['alamat']);

    mysqli_query($conn,"
    UPDATE terapis SET
    nama_terapis='$nama_terapis',
    jenis_kelamin='$jenis_kelamin',
    no_hp='$no_hp',
    alamat='$alamat'
    WHERE id_terapis='$id_terapis'
    ");

    echo "<script>
    alert('Data berhasil diupdate');
    window.location='terapis.php';
    </script>";
    exit;
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

/* EDIT */
$edit = null;

if(isset($_GET['edit'])){

    $id = $_GET['edit'];

    $q = mysqli_query($conn,"
    SELECT *
    FROM terapis
    WHERE id_terapis='$id'
    ");

    $edit = mysqli_fetch_assoc($q);
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
padding:12px 20px;
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
margin-bottom:15px;
border:1px solid #ddd;
border-radius:10px;
}

textarea{
height:100px;
resize:none;
}

button{
background:#b89b72;
color:white;
border:none;
padding:12px 25px;
border-radius:10px;
cursor:pointer;
}

button:hover{
background:#a8895d;
}

table{
width:100%;
margin-top:25px;
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

tr:hover{
background:#faf5ee;
}

.btn{
padding:8px 15px;
border-radius:8px;
text-decoration:none;
color:white;
}

.edit{
background:#d4a017;
}

.hapus{
background:#c0392b;
}

.kosong{
padding:20px;
text-align:center;
color:#777;
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

<h3 style="margin-bottom:15px;color:#6b5b4d;">

<?php if($edit){ ?>
✏️ Edit Terapis
<?php } else { ?>
➕ Tambah Terapis
<?php } ?>

</h3>

<form method="POST">

<?php if($edit){ ?>
<input type="hidden"
name="id_terapis"
value="<?= $edit['id_terapis']; ?>">
<?php } ?>

<input
type="text"
name="nama_terapis"
placeholder="Nama Terapis"
value="<?= $edit['nama_terapis'] ?? ''; ?>"
required>

<select name="jenis_kelamin" required>

<option value="">-- Pilih Jenis Kelamin --</option>

<option value="Laki-laki"
<?= ($edit && $edit['jenis_kelamin']=='Laki-laki') ? 'selected' : ''; ?>>
Laki-laki
</option>

<option value="Perempuan"
<?= ($edit && $edit['jenis_kelamin']=='Perempuan') ? 'selected' : ''; ?>>
Perempuan
</option>

</select>

<input
type="text"
name="no_hp"
placeholder="Nomor HP"
value="<?= $edit['no_hp'] ?? ''; ?>"
required>

<textarea
name="alamat"
placeholder="Alamat Terapis"
required><?= $edit['alamat'] ?? ''; ?></textarea>

<?php if($edit){ ?>

<button type="submit" name="update">
Update Terapis
</button>

<?php } else { ?>

<button type="submit" name="simpan">
Simpan Terapis
</button>

<?php } ?>

</form>

<table>

<tr>
<th>No</th>
<th>Nama Terapis</th>
<th>Jenis Kelamin</th>
<th>No HP</th>
<th>Alamat</th>
<th>Aksi</th>
</tr>

<?php
if(mysqli_num_rows($data) > 0){

$no = 1;

while($row = mysqli_fetch_assoc($data)){
?>

<tr>

<td><?= $no++; ?></td>
<td><?= $row['nama_terapis']; ?></td>
<td><?= $row['jenis_kelamin']; ?></td>
<td><?= $row['no_hp']; ?></td>
<td><?= $row['alamat']; ?></td>

<td>

<a href="?edit=<?= $row['id_terapis']; ?>"
class="btn edit">
Edit
</a>

<a href="?hapus=<?= $row['id_terapis']; ?>"
class="btn hapus"
onclick="return confirm('Yakin ingin menghapus data?')">
Hapus
</a>

</td>

</tr>

<?php
}
}else{
?>

<tr>
<td colspan="6" class="kosong">
Belum ada data terapis
</td>
</tr>

<?php } ?>

</table>

</div>

</div>

</body>
</html>