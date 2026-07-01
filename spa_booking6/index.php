<?php
include "config/koneksi.php";
?>
<!DOCTYPE html>
<html lang="id">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>My Spa Book</title>

    <link rel="stylesheet" href="assets/style.css">

</head>

<body>

<?php include "includes/navbar.php"; ?>

<section class="hero">

    <div class="hero-text">

        <h3>WELCOME TO</h3>

        <h1>MY SPA BOOK</h1>

        <p>
            Relax Your Body, Refresh Your Mind, and Enjoy the Best Spa Experience.
        </p>

        <a href="#" class="btn">
            Book Now
        </a>

    </div>

</section>

<!-- ABOUT -->
<section class="about" id="about">

    <div class="container">

        <div class="about-image">
            <img src="uploads/about.jpg" alt="About">
        </div>

        <div class="about-content">

            <h4>ABOUT US</h4>

            <h2>Welcome to My Spa Book</h2>

            <p>
                My Spa Book adalah tempat relaksasi yang menyediakan layanan spa terbaik dengan suasana nyaman, bersih, dan menenangkan.
            </p>

            <a href="#" class="btn">Read More</a>

        </div>

    </div>


</section>
<?php include "includes/footer.php"; ?>
</body>

</html>