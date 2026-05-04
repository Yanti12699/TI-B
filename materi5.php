<form method="POST">
    Username : <input type="text" name="usernime"><br><br>
    Password : <input type="password" name="password"><br><br>
    Nama : <input type="text" name="nama"><br><br>
    Email : <input type="email" name="email"><br><br>
    <button type="submit" name="kirim">kirim</button>
</form>

<?php
include 'koneksi.php';
if (isset($_POST['username']) && isset($_POST['password']) && isset($_POST['nama']) && isset($_POST['email'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $nama = $_POST['nama'];
    $email = $_POST['email'];

    // Menyimpan data ke database
    $sql = "INSERT INTO user (username, pasword, nama, email) VALUES ('$username', '$password', '$nama', '$email')";
    
    if ($koneksi->query($sql) === TRUE) {
        echo "Data berhasil disimpan!";
    } else {
        echo "Error: " . $sql . "<br>" . $koneksi->error;
    }
}