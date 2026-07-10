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
    position:sticky;
    top:0;
    z-index:999;
}

.logo{
    font-size:28px;
    font-weight:bold;
    color:#8b6f47;
}
.navbar{
    display:flex;
    align-items:center;
    list-style:none;
    gap:35px;
}

.navbar>li{
    position:relative;
}

.navbar>li>a{
    color:#444;
    text-decoration:none;
    font-size:18px;
    font-weight:600;
    transition:.3s;
    padding:8px 0;
}

.navbar>li>a:hover{
    color:#b58c5c;
}

/* ===========================
   DROPDOWN
=========================== */

.dropdown-menu{
    position:absolute;
    top:45px;
    left:50%;
    transform:translateX(-50%);
    background:#fff;
    min-width:180px;
    border-radius:12px;
    list-style:none;
    box-shadow:0 10px 25px rgba(0,0,0,.12);

    opacity:0;
    visibility:hidden;
    transition:.3s;
}

.dropdown:hover .dropdown-menu{
    opacity:1;
    visibility:visible;
    top:55px;
}

.dropdown-menu li{
    border-bottom:1px solid #eee;
}

.dropdown-menu li:last-child{
    border-bottom:none;
}

.dropdown-menu li a{
    display:block;
    padding:14px 18px;
    color:#555;
    text-decoration:none;
    transition:.3s;
}

.dropdown-menu li a:hover{
    background:#f4e6d4;
    color:#8b6f47;
}

/* ===========================
   LOGIN BUTTON
=========================== */

.btn-login{
    background:#b89463;
    color:white !important;
    padding:12px 28px !important;
    border-radius:8px;
    transition:.3s;
}

.btn-login:hover{
    background:#9b774c;
    color:white !important;
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
        <ul class="navbar">

            <li><a href="#about">About</a></li>

            <li class="dropdown">

                <a href="#">Service ▾</a>

                <ul class="dropdown-menu">

                    <li><a href="#layanan">Layanan</a></li>

                    <li><a href="#terapis">Terapis</a></li>

                </ul>

            </li>

            <li><a href="#pricing">Pricing</a></li>

            <li><a href="#contact">Contact</a></li>

            <li>
                <a href="login.php" class="btn-login">
                    Login
                </a>
            </li>

        </ul>
    </nav>

</header>


<section class="section" id="about">

    <h2 class="section-title">
        About Us
    </h2>

    <p class="about-text">
        Spa Booking merupakan layanan reservasi spa yang menyediakan berbagai
        perawatan tubuh dengan terapis profesional dan fasilitas terbaik.
        Kami berkomitmen memberikan pengalaman relaksasi yang nyaman,
        aman, dan berkualitas bagi setiap pelanggan.
    </p>

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
<section class="section" id="pricing">

    <h2 class="section-title">
        Pricing
    </h2>

    <div class="cards">

        <div class="card">

            <div class="card-body">

                <h3>Massage Therapy</h3>

                <p>60 Menit</p>

                <h2>Rp150.000</h2>

            </div>

        </div>

        <div class="card">

            <div class="card-body">

                <h3>Facial Treatment</h3>

                <p>90 Menit</p>

                <h2>Rp200.000</h2>

            </div>

        </div>

        <div class="card">

            <div class="card-body">

                <h3>Body Spa</h3>

                <p>120 Menit</p>

                <h2>Rp250.000</h2>

            </div>

        </div>

    </div>

</section>
<section class="section" id="contact">

    <h2 class="section-title">
        Contact Us
    </h2>

    <div class="contact-box">

        <p><strong>📍 Alamat :</strong> Jl. Spa No. 10, Indonesia</p>

        <p><strong>📞 Telepon :</strong> 0812-3456-7890</p>

        <p><strong>📧 Email :</strong> info@spabooking.com</p>

        <p><strong>🕒 Jam Operasional :</strong> 09.00 - 21.00 WIB</p>

    </div>

</section>

<footer>

© 2025 Spa Booking System

</footer>

</body>
</html>