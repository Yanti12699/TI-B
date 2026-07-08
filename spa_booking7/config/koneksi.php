<?php
// ================================
// KONEKSI DATABASE MYSPA_BOOK
// ================================

$host = "localhost";
$user = "root";
$pass = "";
$db   = "myspa_book";

// Membuat koneksi
$conn = mysqli_connect($host, $user, $pass, $db);

// Mengecek koneksi
if (!$conn) {
    die("Koneksi database gagal: " . mysqli_connect_error());
}

// Mengatur timezone Indonesia
date_default_timezone_set("Asia/Jakarta");
?>