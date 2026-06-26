<?php
include "../config/koneksi.php";

$id = $_GET['id'];

mysqli_query($conn,"
UPDATE pembayaran
SET status_pembayaran='Ditolak'
WHERE id_pembayaran='$id'
");

header("Location: pembayaran.php");