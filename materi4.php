<?php
include 'koneksi.php';

if (isset($_GET['hapus'])) {
    $id = $_GET['hapus'];
    mysqli_query($koneksi, "DELETE FROM user WHERE id='$id'");
    header("Location: materi4.php");
    exit;
}

if (isset($_POST['update'])) {
    mysqli_query($koneksi, "UPDATE user SET 
        username='$_POST[username]',
        password='$_POST[password]',
        nama='$_POST[nama]',
        email='$_POST[email]'
        WHERE id='$_POST[id]'
    ");
    header("Location: materi4.php");
    exit;
}

$dataEdit = null;
if (isset($_GET['edit'])) {
    $idEdit = $_GET['edit'];
    $resultEdit = mysqli_query($koneksi, "SELECT * FROM user WHERE id='$idEdit'");
    $dataEdit = mysqli_fetch_assoc($resultEdit);
}
?>

<form method="POST">
    Username:<input type="text" name="username"><br>
    Password :<input type="password" name="password"><br>
    Nama :<input type="text" name="nama"><br>
    Email :<input type="text" name="email"><br>
    <input type="submit" value="Kirim Data" name = "kirim"><br>
</form>

<?php
if (isset($_POST['kirim'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $nama = $_POST['nama'];
    $email = $_POST['email'];

    $query = "INSERT INTO user (username, password, nama, email) 
              VALUES ('$username', '$password', '$nama', '$email')";

    if (mysqli_query($koneksi, $query)) {
        echo "Data berhasil ditambah";
    } else {
        echo "Data gagal ditambahkan";
    }
}
?>

<?php if ($dataEdit) { ?>
<form method="POST">
    <input type="hidden" name="id" value="<?= $dataEdit['id'] ?>">
    Username: <input type="text" name="username" value="<?= $dataEdit['username'] ?>"><br>
    Password: <input type="text" name="password" value="<?= $dataEdit['password'] ?>"><br>
    Nama: <input type="text" name="nama" value="<?= $dataEdit['nama'] ?>"><br>
    Email: <input type="text" name="email" value="<?= $dataEdit['email'] ?>"><br>
    <button type="submit" name="update">Update</button>
</form>
<br>
<?php } ?>

<table border="1" cellpadding="10" cellspacing="0">
<tr>
    <th>Id</th>
    <th>Username</th>
    <th>Password</th>
    <th>Nama</th>
    <th>Email</th>
    <th>Aksi</th>
</tr>

<?php
$query = "SELECT * FROM user";
$result = mysqli_query($koneksi, $query);
while ($row = mysqli_fetch_assoc ($result)) {
    echo "<tr>";
    echo "<td>" . $row['id'] . "</td>";
    echo "<td>" . $row['username'] . "</td>";
    echo "<td>" . $row['password'] . "</td>";
    echo "<td>" . $row['nama'] . "</td>";
    echo "<td>" . $row['email'] . "</td>";
    echo "<td><a href='materi4.php?edit=" . $row['id'] . "'>Edit</a> |<a href='materi4.php?hapus=" .$row['id'] . "'>Hapus</a></td>";
    echo "</tr>";
}

if (isset($_POSt['kirim'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];
        $nama = $_POST['nama'];
        $email = $_POST['email'];
        $query = "UPDATE user SET username = '$username', password = '$password', nama = '$nama', email = '$email' WHERE id = '$id";

        if (mysqli_query($koneksi, $query)) {
            echo "data berhasil diupdate";
        }  else {
            echo "data gagal diupdate";
        }
}