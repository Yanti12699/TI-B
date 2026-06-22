<?php
include "../config/koneksi.php";

if(!isset($_SESSION['id_user'])){
    header("Location: ../login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Data Booking</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial, sans-serif;
}

body{
    background:#f4f6f9;
}

.container{
    width:95%;
    margin:30px auto;
}

.header{
    background:#007bff;
    color:white;
    padding:15px;
    border-radius:10px;
    margin-bottom:20px;
}

.card{
    background:white;
    padding:20px;
    border-radius:10px;
    box-shadow:0 2px 10px rgba(0,0,0,0.1);
}

table{
    width:100%;
    border-collapse:collapse;
    margin-top:15px;
}

table th{
    background:#007bff;
    color:white;
    padding:12px;
}

table td{
    border:1px solid #ddd;
    padding:10px;
    text-align:center;
}

.btn{
    text-decoration:none;
    background:#28a745;
    color:white;
    padding:10px 15px;
    border-radius:5px;
}

.back{
    background:red;
}

</style>

</head>
<body>

<div class="container">

<div class="header">
    <h2>Data Booking Spa</h2>
</div>

<div class="card">

<a href="dashboard.php" class="btn back">
Kembali Dashboard
</a>

<br><br>

<table>

<tr>
    <th>No</th>
    <th>ID Booking</th>
    <th>Status</th>
</tr>

<?php

$no = 1;

$query = mysqli_query($conn,"
SELECT * FROM booking
");

while($data = mysqli_fetch_assoc($query))
{
?>

<tr>
    <td><?= $no++; ?></td>

    <td><?= $data['id_booking']; ?></td>

    <td><?= $data['status']; ?></td>
</tr>

<?php } ?>

</table>

</div>

</div>

</body>
</html>