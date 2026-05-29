<script setup>
import { ref, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

const props = defineProps({
  slides: { type: Array, required: true },
});

const prevEl = ref(null);
const nextEl = ref(null);

const modules = [Navigation, Pagination, Autoplay];

const navigationOptions = computed(() => ({
  prevEl: prevEl.value,
  nextEl: nextEl.value,
}));
</script>

<template>
  <div class="slider full-bleed mt-3">
    <!-- Buttons INSIDE the swiper wrapper div, before Swiper -->
    <div ref="prevEl" class="slider-nav slider-nav--prev">
      <button class="glass">
        <FontAwesomeIcon :icon="faAngleLeft" />
      </button>
    </div>

    <div ref="nextEl" class="slider-nav slider-nav--next">
      <button class="glass">
        <FontAwesomeIcon :icon="faAngleRight" />
      </button>
    </div>

    <Swiper
      :modules="modules"
      :slides-per-view="1"
      :breakpoints="{
        992: { slidesPerView: 1.5 },
        1510: { slidesPerView: 2 },
      }"
      :navigation="navigationOptions"
      :centered-slides="true"
      :space-between="20"
      :loop="true"
      :pagination="{ clickable: true }"
    >
      <SwiperSlide v-for="slide in slides" :key="slide.id">
        <img :src="slide.image" :alt="slide.title" />
        <NuxtLink
          v-if="slide.link"
          class="cta glass slider__cta"
          :to="slide.link"
        >
          {{ slide.buttonText }} <FontAwesomeIcon :icon="faAngleRight" />
        </NuxtLink>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style scoped>
.swiper-slide-prev{
  .slider__cta{
    display: none;
  }
}
</style>
