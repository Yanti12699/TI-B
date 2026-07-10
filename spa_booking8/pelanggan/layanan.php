<?php
include "../config/koneksi.php";

if(session_status() == PHP_SESSION_NONE){
    session_start();
}

if(!isset($_SESSION['id_user'])){
    header("Location: ../login.php");
    exit;
}

$data = mysqli_query($conn,"
SELECT layanan.*, kategori.nama_kategori
FROM layanan
LEFT JOIN kategori ON layanan.id_kategori = kategori.id_kategori
ORDER BY layanan.id_layanan DESC
");
?>

<!DOCTYPE html>
<html>
<head>
<title>Daftar Layanan Spa</title>

<style>

body{
    background:#F8F4EC;
    font-family:'Segoe UI',sans-serif;
    margin:0;
}

.container{
    width:90%;
    max-width:1400px;
    margin:30px auto;
}

h1{
    color:#6B5B4D;
    text-align:center;
    font-size:50px;
    margin-bottom:40px;
}

.grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:30px;
}

.card{
    background:#fff;
    border-radius:25px;
    overflow:hidden;
    box-shadow:0 8px 20px rgba(0,0,0,.12);
    transition:.3s;
}

.card:hover{
    transform:translateY(-8px);
}

.card img{
    width:100%;
    height:320px;
    object-fit:cover;
}

.content{
    padding:25px;
}

.content h3{
    color:#6B5B4D;
    font-size:22px;
    margin-bottom:15px;
}

.content p{
    color:#555;
    line-height:1.7;
}


.kembali{
    display:inline-block;
    margin-bottom:20px;
    padding:12px 20px;
    background:#6B5B4D;
    color:white;
    text-decoration:none;
    border-radius:10px;
}
</style>
</head>

<body>

<div class="container">

<a href="dashboard.php" class="kembali">← Kembali</a>

<h1>Daftar Layanan Spa</h1>

<div class="grid">

<?php
if(mysqli_num_rows($data) > 0){
    while($row=mysqli_fetch_assoc($data)){
?>

<div class="card">

<img src="../admin/upload/layanan/<?= $row['gambar']; ?>" alt="Layanan Spa">

<div class="content">

<h3><?= $row['nama_layanan']; ?></h3>
<small style="color:#B89B72;font-weight:bold;">
<?= $row['nama_kategori']; ?>
</small>

<p>
<?= substr($row['deskripsi'],0,70); ?>...
</p>

</div>
</div>

<?php
    }
}else{
    echo "<h3>Belum ada layanan spa.</h3>";
}
?>

</div>

</div>

</body>
</html>