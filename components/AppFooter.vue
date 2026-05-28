<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

const openingHours = [
  {
    day: "Mandag",
    opening: "13:00",
    closing: "22:00",
  },
  {
    day: "Tirsdag",
    opening: "13:00",
    closing: "22:00",
  },
  {
    day: "Onsdag",
    opening: "13:00",
    closing: "24:00",
  },
  {
    day: "Torsdag",
    opening: "13:00",
    closing: "24:00",
  },
  {
    day: "Fredag",
    opening: "13:00",
    closing: "02:00",
  },
  {
    day: "Lørdag",
    opening: "15:00",
    closing: "02:00",
  },
  {
    day: "Søndag",
    opening: "Lukket",
    closing: "",
  },
];
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
        </div>

        <div class="footer_hours">
          <OpeningHours :openingHours="openingHours" />
        </div>
      </div>

      <!-- BOTTOM ROW -->
      <div class="footer_bottom">
        <div class="footer_brand">
          <p class="footer_heading">Studenterhuset©</p>
          <p>Gammeltorv 10</p>
          <p>9000 Aalborg</p>
          <div class="footer_legal">
            <a href="#">Cookiepolitik</a>
            <a href="#">Terms and conditions</a>
          </div>
        </div>

        <div class="footer_social">
          <p class="footer_heading">Find os på:</p>
          <div class="social_icons">
            <a href="#" target="_blank">
              <FontAwesomeIcon :icon="faFacebook" />
              <span>Facebook</span>
            </a>
            <a href="#" target="_blank">
              <FontAwesomeIcon :icon="faInstagram" />
              <span>Instagram</span>
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
  padding: 40px 20px;
  color: white;
}

.footer_inner {
  max-width: 1050px;
  margin: 0 auto;
}

.footer_heading {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
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
  gap: 32px;
  align-items: flex-start;
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
}

.footer_legal a {
  font-size: 14px;
  opacity: 0.8;
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
