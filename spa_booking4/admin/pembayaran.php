<?php
include "../config/koneksi.php";

$data = mysqli_query($conn,"
SELECT
pembayaran.*,
users.nama,
layanan.nama_layanan
FROM pembayaran

JOIN booking
ON pembayaran.id_booking=booking.id_booking

JOIN users
ON booking.id_user=users.id_user

JOIN layanan
ON booking.id_layanan=layanan.id_layanan
");
?>

<h2>Verifikasi Pembayaran</h2>

<table border="1" cellpadding="10">

<tr>
<th>Pelanggan</th>
<th>Layanan</th>
<th>Metode</th>
<th>Bukti</th>
<th>Status</th>
<th>Aksi</th>
</tr>

<?php
while($d=mysqli_fetch_assoc($data)){
?>

<tr>

<td><?= $d['nama']; ?></td>

<td><?= $d['nama_layanan']; ?></td>

<td><?= $d['metode_bayar']; ?></td>

<td>

<?php
if($d['bukti_bayar']!=''){
?>

<a target="_blank"
href="../upload/<?= $d['bukti_bayar']; ?>">
Lihat Bukti
</a>

<?php } ?>

</td>

<td>
<?= $d['status_pembayaran']; ?>
</td>

<td>

<a href="verifikasi.php?id=<?= $d['id_pembayaran']; ?>">
Verifikasi
</a>

|

<a href="tolak.php?id=<?= $d['id_pembayaran']; ?>">
Tolak
</a>

</td>

</tr>

<?php } ?>

</table>