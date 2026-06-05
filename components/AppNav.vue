<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import Logo from '../assets/images/Studenterhuset_logo.svg?component';

// Giver adgang til den aktuelle URL-sti, fx "/concerts"
const route = useRoute();

// Lukker mobilmenuen automatisk hver gang brugeren navigerer til en ny side
watch(
  () => route.path,
  () => {
    menuOpen.value = false;
  },
);

// Holder styr på vinduets bredde, så vi kan skifte mellem desktop- og mobilnavigation
const windowWidth = ref(0);

// Styrer om mobilmenuen er åben eller lukket
const menuOpen = ref(false);

// Opdaterer windowWidth når brugeren ændrer vinduets størrelse
const handleResize = () => (windowWidth.value = window.innerWidth);

// Sætter den indledende bredde og lytter på resize-events så navigationens layout skifter live
onMounted(() => {
  windowWidth.value = window.innerWidth;
  window.addEventListener("resize", handleResize);
});

// Rydder op ved at fjerne event-listeneren når komponenten fjernes fra siden, vigtigt for at undgå memory leaks
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <nav v-if="windowWidth > 992" class="navigation">
    <div class="home">
      <NuxtLink to="/">
        <Logo class="logo" alt="Studenterhuset logo" />
      </NuxtLink>
    </div>
    <div class="site_navigation">
      <NuxtLink to="/concerts">Koncerter</NuxtLink>
      <NuxtLink to="/events">Begivenheder</NuxtLink>
      <NuxtLink to="/cafe">Caféen</NuxtLink>
      <NuxtLink to="/about">Om Studenterhuset</NuxtLink>
      <NuxtLink to="/student">Til studerende</NuxtLink>
    </div>
  </nav>
  <nav
    v-else-if="windowWidth <= 992"
    :class="['navigation_mobile', { open: menuOpen }]"
  >
    <div class="mobile_bottom">
      <div class="mobile_logo">
        <NuxtLink to="/">
          <Logo class="logo" />
        </NuxtLink>
      </div>
      <NuxtLink to="/concerts">Koncerter</NuxtLink>
      <NuxtLink to="/events">Begivenheder</NuxtLink>
      <NuxtLink to="/cafe">Caféen</NuxtLink>
      <NuxtLink to="/about">Om Studenterhuset</NuxtLink>
      <NuxtLink to="/student">Til studerende</NuxtLink>
    </div>
  </nav>
  <button class="burgermenu" @click="menuOpen = !menuOpen">
    <FontAwesomeIcon :icon="menuOpen ? faXmark : faBars" />
  </button>
</template>

<style scoped>
.navigation_mobile {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px;
  z-index: 998;
  background: var(--primary);
}

.navigation_mobile.open {
  transform: translateX(0);
}

.mobile_bottom {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  padding-right: 60px;
  margin: auto 0 60px auto;

  a {
    margin: 8px 0;
    font-size: 32px;
    font-weight: 400;
    text-decoration: none;
    color: white;
    font-family: "Barlow Condensed", sans-serif;
  }
}

a.router-link-exact-active {
    text-shadow: 0 0 2px white;
  }

.mobile_logo {
  margin-bottom: 16px;
}

.mobile_logo .logo {
  height: 25px;
  width: auto;
  color: white;
  transition: transform 0.2s ease
}

.mobile_logo a.router-link-exact-active :deep(.logo) {
  transform: scale(1.05);
}

.burgermenu {
  width: 60px;
  height: 60px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  color: white;
  background-color: var(--primary);
  border-radius: 50%;
  border: none;

  svg {
    width: 30px;
    height: 30px;
  }
}

/* @media (min-width: 500px) {
  .mobile_bottom {
    margin: auto 0 60px auto;
  }
} */

@media screen and (min-width: 993px) {
  .burgermenu {
    display: none;
  }

  .navigation {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 50px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    margin: 0;
    border-radius: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .site_navigation {
    a {
      text-decoration: none;
      font-size: 24px;
      padding: 8px;
      margin: 5px;
      color: white;
      font-family: "Barlow Condensed", sans-serif;
      transition: 0.15s ease;
    }

    a:hover {
      color: white;
      text-shadow: 0 0 2px white;
}

a.router-link-exact-active {
  color: white;
  text-shadow: 0 0 2px white;
}
  }

  .home .logo {
    height: 30px;
    width: auto;
    color: white;
    transition: transform 0.2s ease;
  }

  .home a:hover :deep(.logo) {
    transform: scale(1.01);
  }

  .home a.router-link-exact-active :deep(.logo) {
  transform: scale(1.01);
}

}
</style>