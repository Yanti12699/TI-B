<?php
include "../config/koneksi.php";

$id = $_GET['id'];

mysqli_query($conn,"
UPDATE booking
SET status='Batal'
WHERE id_booking='$id'
");

header("Location: booking.php");
exit;
?>