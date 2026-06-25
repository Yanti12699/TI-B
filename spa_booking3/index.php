<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Spa Booking</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:'Segoe UI',sans-serif;
}

body{
background:#faf7f2;
}

/* HEADER */

header{
background:#f4e6d4;
padding:20px 8%;
display:flex;
justify-content:space-between;
align-items:center;
}

.logo{
font-size:28px;
font-weight:bold;
color:#8b6f47;
}

nav a{
text-decoration:none;
margin-left:20px;
color:#555;
font-weight:600;
}

.btn-login{
background:#b89b72;
color:white;
padding:10px 20px;
border-radius:10px;
}

/* HERO */

.hero{
padding:70px 8%;
display:flex;
align-items:center;
justify-content:space-between;
}

.hero-text{
width:50%;
}

.hero-text h1{
font-size:52px;
color:#6b5b4d;
margin-bottom:20px;
}

.hero-text p{
font-size:18px;
color:#666;
line-height:1.7;
margin-bottom:25px;
}

.hero-text a{
background:#b89b72;
color:white;
padding:15px 30px;
text-decoration:none;
border-radius:12px;
}

.hero-img{
width:45%;
}

.hero-img img{
width:100%;
border-radius:25px;
}

/* SECTION */

.section{
padding:60px 8%;
}

.section-title{
text-align:center;
font-size:34px;
color:#6b5b4d;
margin-bottom:40px;
}

/* CARD */

.cards{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
gap:25px;
}

.card{
background:white;
border-radius:20px;
overflow:hidden;
box-shadow:0 3px 15px rgba(0,0,0,.08);
}

.card img{
width:100%;
height:220px;
object-fit:cover;
}

.card-body{
padding:20px;
}

.card-body h3{
margin-bottom:10px;
color:#6b5b4d;
}

.card-body p{
color:#666;
margin-bottom:15px;
}

.card-body a{
background:#b89b72;
color:white;
padding:10px 20px;
text-decoration:none;
border-radius:10px;
}

/* FOOTER */

footer{
background:#f4e6d4;
text-align:center;
padding:25px;
margin-top:50px;
color:#6b5b4d;
}

</style>

</head>
<body>

<header>

<div class="logo">
🌿 Spa Booking
</div>

<nav>
<a href="#layanan">Layanan</a>
<a href="#terapis">Terapis</a>
<a href="login.php" class="btn-login">Login</a>
</nav>

</header>

<section class="hero">

<div class="hero-text">

<h1>Relax, Refresh & Rejuvenate</h1>

<p>
Nikmati pengalaman spa terbaik dengan layanan profesional
dan terapis berpengalaman.
</p>

<a href="login.php">
Booking Sekarang
</a>

</div>

<div class="hero-img">

<img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874">

</div>

</section>

<section class="section" id="layanan">

<h2 class="section-title">
Layanan Spa Populer
</h2>

<div class="cards">

<div class="card">

<img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15">

<div class="card-body">
<h3>Massage Therapy</h3>
<p>Relaksasi tubuh dan pikiran.</p>

<a href="login.php">
Booking
</a>
</div>

</div>

<div class="card">

<img src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd">

<div class="card-body">
<h3>Facial Treatment</h3>
<p>Perawatan wajah premium.</p>

<a href="login.php">
Booking
</a>
</div>

</div>

<div class="card">

<img src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1">

<div class="card-body">
<h3>Body Spa</h3>
<p>Perawatan tubuh menyeluruh.</p>

<a href="login.php">
Booking
</a>
</div>

</div>

</div>

</section>

<section class="section" id="terapis">

<h2 class="section-title">
Terapis Profesional
</h2>

<div class="cards">

<div class="card">

<img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330">

<div class="card-body">
<h3>Terapis Aulia</h3>
<p>Spesialis Body Treatment.</p>
</div>

</div>

<div class="card">

<img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80">

<div class="card-body">
<h3>Terapis Nisa</h3>
<p>Spesialis Facial Therapy.</p>
</div>

</div>

<div class="card">

<img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2">

<div class="card-body">
<h3>Terapis Sinta</h3>
<p>Spesialis Relax Massage.</p>
</div>

</div>

</div>

</section>

<footer>

© 2025 Spa Booking System

</footer>

</body>
</html>