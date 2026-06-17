<?php
include "config/koneksi.php";

$error = "";

if(isset($_POST['login'])){

    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);

    $query = mysqli_query($conn,"
        SELECT * FROM users
        WHERE email='$email'
    ");

    if(mysqli_num_rows($query) > 0){

        $data = mysqli_fetch_assoc($query);

        if($password == $data['password']){

            $_SESSION['id_user'] = $data['id_user'];
            $_SESSION['nama'] = $data['nama'];
            $_SESSION['role'] = $data['role'];

            if($data['role'] == 'admin'){
                header("Location: admin/dashboard.php");
            }else{
                header("Location: pelanggan/dashboard.php");
            }

            exit;

        }else{
            $error = "Password salah!";
        }

    }else{
        $error = "Email tidak ditemukan!";
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login Spa Booking</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:'Segoe UI',sans-serif;
}

body{
min-height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:linear-gradient(135deg,#F8F4EC,#E8DCCB);
}

.container{
width:900px;
max-width:95%;
background:white;
border-radius:25px;
overflow:hidden;
display:flex;
box-shadow:0 10px 30px rgba(0,0,0,0.1);
}

.left{
width:50%;
background:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2)),
url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874');
background-size:cover;
background-position:center;
display:flex;
flex-direction:column;
justify-content:center;
padding:40px;
color:white;
}

.left h1{
font-size:38px;
margin-bottom:10px;
}

.left p{
line-height:1.7;
}

.right{
width:50%;
padding:50px;
}

.logo{
text-align:center;
font-size:50px;
margin-bottom:10px;
}

.right h2{
text-align:center;
margin-bottom:25px;
color:#6B5B4D;
}

label{
display:block;
margin-bottom:5px;
font-weight:bold;
color:#6B5B4D;
}

input{
width:100%;
padding:12px;
margin-bottom:15px;
border:1px solid #ddd;
border-radius:10px;
outline:none;
}

input:focus{
border-color:#B89B72;
}

button{
width:100%;
padding:13px;
border:none;
border-radius:10px;
background:#B89B72;
color:white;
font-size:15px;
cursor:pointer;
}

button:hover{
background:#9E835F;
}

.error{
background:#ffe5e5;
color:#c0392b;
padding:10px;
border-radius:8px;
margin-bottom:15px;
text-align:center;
}

.register{
text-align:center;
margin-top:20px;
}

.register a{
text-decoration:none;
color:#B89B72;
font-weight:bold;
}

@media(max-width:768px){

.container{
flex-direction:column;
}

.left,
.right{
width:100%;
}

}

</style>
</head>
<body>

<div class="container">

<div class="left">
<h1>🌿 Spa Booking</h1>
<p>
Nikmati pengalaman spa terbaik dan kelola semua reservasi dengan mudah.
</p>
</div>

<div class="right">

<div class="logo">🪷</div>

<h2>Login Akun</h2>

<?php if($error != ""){ ?>
<div class="error"><?= $error; ?></div>
<?php } ?>

<form method="POST">

<label>Email</label>
<input type="email" name="email" required>

<label>Password</label>
<input type="password" name="password" required>

<button type="submit" name="login">
Masuk
</button>

</form>

<div class="register">
Belum punya akun?
<a href="register.php">Daftar</a>
</div>

</div>

</div>

</body>
</html>