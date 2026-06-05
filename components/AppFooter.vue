<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// Importerer brand-ikoner til Facebook og Instagram
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
// Importerer SVG-logoet som en Vue-komponent så det kan styles med CSS (fx farve via "color")
import Logo from "../assets/images/Studenterhuset_logo.svg?component";
</script>

<template>
  <footer class="site_footer">
    <div class="footer_inner">
      <!-- TOP ROW -->
      <div class="footer_top">
        <div class="footer_nav">
          <p class="footer_heading">Relevante links</p>
          <nav>
            <NuxtLink to="/about">Om os</NuxtLink>
            <NuxtLink to="/student">Til studerende</NuxtLink>
            <NuxtLink to="/cafe">Caféen</NuxtLink>
            <NuxtLink to="/about">FAQ</NuxtLink>
            <NuxtLink to="/about">Kontakt</NuxtLink>
          </nav>
        </div>

        <div class="footer_contact">
          <p class="footer_heading">Kontakt</p>
          <p>+45 31 41 04 74</p>
          <p>kontoret@studenterhuset.dk</p>
          <p>Gammeltorv 10</p>
          <p>9000 Aalborg</p>
        </div>

        <div class="footer_hours">
          <OpeningHours :openingHours="openingHours" />
        </div>
      </div>

      <!-- BOTTOM ROW -->
      <div class="footer_bottom">
        <Logo class="logo" alt="Studenterhuset logo" />

        <div class="footer_brand">
          <div class="footer_legal">
            <a href="#">Cookiepolitik</a>
            <a href="#">Terms and conditions</a>
            <p class="footer_heading">Studenterhuset©</p>
          </div>
        </div>

        <div class="footer_social">
          <div class="social_icons">
            <a href="#" target="_blank">
              <FontAwesomeIcon :icon="faFacebook" />
            </a>
            <a href="#" target="_blank">
              <FontAwesomeIcon :icon="faInstagram" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site_footer {
  background-color: #5774b8;
  color: white;

  * {
    font-family: "Inter", sans-serif;
  }
}

.footer_inner {
  padding: 50px 150px;
  margin: 0 auto;
  box-sizing: border-box;
}

p,
a {
  font-size: 16px;
  color: white;
  text-decoration: none;
  line-height: 1.8;
}

/* TOP: stacked on mobile, 3-col on desktop */
.footer_top {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 32px;
}

@media (min-width: 670px) {
  .footer_top {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .footer_inner {
    padding: 30px 20px;
    .footer_social {
      margin: 0 auto;
    }
  }
}

@media (min-width: 992px) {
  .footer_top {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.footer_nav nav {
  display: flex;
  flex-direction: column;
}

/* Opening hours */
.hours_row {
  display: flex;
  gap: 16px;
  font-size: 16px;
  line-height: 1.8;
}

.hours_row span:first-child {
  min-width: 80px;
}

/* BOTTOM: stacked on mobile, split on desktop */
.footer_bottom {
  display: flex;
  flex-direction: column;
  gap: 16px;

  svg {
    max-width: 400px;
  }
}

@media (min-width: 670px) {
  .footer_bottom {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.footer_brand {
  text-align: left;
  margin: 0 auto;
}

@media (min-width: 670px) {
  .footer_brand {
    text-align: center;
  }
}

.footer_legal {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-family: "inter", sans-serif;

  a {
    font-size: 16px;
  }
}

/* Social icons */
.social_icons {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  font-size: 40px;
}

.social_icons svg {
  font-size: 40px;
}

.social_icons a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.social_icons img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.opening-hours {
  max-width: 200px;
}
</style>
