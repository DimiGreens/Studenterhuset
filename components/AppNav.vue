<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faAngleUp, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

const route = useRoute();

watch(
  () => route.path,
  () => {
    menuOpen.value = false;
  },
);

const atTop = ref(true);
const windowWidth = ref(0);
const menuOpen = ref(false);

const handleScroll = () => (atTop.value = window.scrollY === 0);
const handleResize = () => (windowWidth.value = window.innerWidth);
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  windowWidth.value = window.innerWidth;
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <nav
    v-if="windowWidth > 992"
    :class="['glass', 'navigation', { scrolled: !atTop }]"
  >
    <div class="home">
      <NuxtLink to="/"
        ><img
          src="../assets/images/Studenterhuset_logo.png"
          alt="Studenterhuset logo"
      /></NuxtLink>
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
    :class="['navigation_mobile', 'glass', { open: menuOpen }]"
  >
    <NuxtLink to="/"><span class="font-style-heading">Forside</span></NuxtLink>
    <NuxtLink to="/concerts"><span class="font-style-heading">Koncerter</span></NuxtLink>
    <NuxtLink to="/events">Begivenheder</NuxtLink>
    <NuxtLink to="/cafe">Caféen</NuxtLink>
    <NuxtLink to="/about">Om Studenterhuset</NuxtLink>
    <NuxtLink to="/student">Til studerende</NuxtLink>
  </nav>
  <Transition name="slide">
    <button v-if="!atTop" class="to_top_button glass" @click="scrollToTop">
      <FontAwesomeIcon :icon="faAngleUp" />
    </button>
  </Transition>
  <button class="burgermenu glass" @click="menuOpen = !menuOpen">
    <FontAwesomeIcon :icon="menuOpen ? faXmark : faBars" />
  </button>
</template>

<style scoped>
.navigation_mobile {
  position: fixed;
  bottom: 20px;
  right: 20px;
  transform: translateX(120%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  padding: 30px;
  border-radius: 8px;
  z-index: 999;
  padding-bottom: 80px;

  a {
    margin: 15px;
    font-size: 24px;
    text-decoration: none;
    color: white;
    font-family: "Barlow Condensed", sans-serif;
  }
}

.navigation_mobile.open {
  transform: translateX(0);
}

.burgermenu {
  width: 60px;
  height: 60px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  color: white;

  svg {
    width: 30px;
    height: 30px;
  }
}

.to_top_button {
  width: 60px;
  height: 60px;
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 999;
  color: white;

  svg {
    width: 30px;
    height: 30px;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
}

@media screen and (min-width: 993px) {
  .burgermenu {
    display: none;
  }

  .to_top_button {
    display: none;
  }

  .navigation {
    height: 125px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 50px;
    transition: height 0.3s ease;
    position: fixed; /* ← was sticky */
    top: 0;
    z-index: 100;
    margin: 15px;
    width: calc(100% - 30px); /* ← add this */
  }

  .scrolled {
    height: 80px;
  }

  .site_navigation {
    a {
      text-decoration: none;
      font-size: 28px;
      padding: 15px;
      margin: 15px;
      color: white;
      font-family: "Barlow Condensed", sans-serif;
    }
  }
}

@media screen and (min-width: 992px) and (max-width: 1500px) {
  .site_navigation a {
    font-size: 24px;
    padding: 8px;
    margin: 5px;
  }

  .navigation {
    padding-inline: 20px;
  }

  .home img {
    height: 30px;
    width: auto;
  }
}
</style>
