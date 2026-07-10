<?php
include "../config/koneksi.php";

$id_booking = $_POST['id_booking'];
$metode = $_POST['metode_bayar'];

$nama_file = '';

if($_FILES['bukti']['name'] != ''){

    $nama_file =
    time().'_'.$_FILES['bukti']['name'];

    move_uploaded_file(
        $_FILES['bukti']['tmp_name'],
        "../upload/".$nama_file
    );
}

mysqli_query($conn,"
INSERT INTO pembayaran
(
id_booking,
metode_bayar,
bukti_bayar,
status_pembayaran
)
VALUES
(
'$id_booking',
'$metode',
'$nama_file',
'Menunggu'
)
");

header("Location: riwayat_booking.php");
exit;