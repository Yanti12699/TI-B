<?php
include "config/koneksi.php";
?>

<!DOCTYPE html>
<html lang="id">
<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Tentang Kami | My Spa Book</title>

    <link rel="stylesheet" href="assets/style.css">

</head>

<body>

<?php include "includes/navbar.php"; ?>

<section class="about-page">

    <div class="container">

        <div class="about-image">

            <img src="uploads/about.jpg" alt="About My Spa">

        </div>

        <div class="about-text">

            <h4>ABOUT US</h4>

            <h1>Welcome to My Spa Book</h1>

            <p>
                My Spa Book merupakan tempat relaksasi yang menghadirkan berbagai
                perawatan tubuh dengan suasana yang nyaman, tenang, dan mewah.
                Kami menyediakan layanan spa, body massage, facial treatment,
                aromatherapy, dan berbagai terapi lainnya yang dilakukan oleh
                terapis profesional.
            </p>

            <p>
                Kepuasan pelanggan adalah prioritas utama kami. Dengan pelayanan
                terbaik dan produk berkualitas, kami siap memberikan pengalaman
                spa yang menyenangkan untuk setiap pelanggan.
            </p>

            <a href="pelanggan/booking.php" class="btn">
                Booking Sekarang
            </a>

        </div>

    </div>

</section>

<?php include "includes/footer.php"; ?>

</body>
</html>