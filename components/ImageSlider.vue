<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
    slides: {
        type: Array,
        required: true
    }
})

const swiperRef = ref(null)
const onSwiper = (swiper) => {
    swiperRef.value = swiper
}

const modules = [Navigation, Pagination, Autoplay]
</script>

<template>
    <div class="slider_wrapper">
        <Swiper
        @swiper="onSwiper"
        :modules="modules"
        :slides-per-view="1"
        :breakpoints="{
            992: { slidesPerView: 1.5 },
            1510: { slidesPerView: 2 }
        }"
        :centered-slides="true"
        :space-between="20"
        :loop="true"
        :watch-slides-progress="true"
        :pagination="{ clickable: true }"
        >
            <SwiperSlide v-for="slide in slides" :key="slide.id">
                <img :src="slide.image" :alt="slide.title" />
                <NuxtLink to="/concerts" class="slider_button glass">
                    Opdag koncerter <FontAwesomeIcon :icon="faAngleRight" />
                </NuxtLink>
            </SwiperSlide>
        </Swiper>

        <div class="prev_button_wrapper">
            <button class="nav-prev glass" @click="swiperRef?.slidePrev()">
                <FontAwesomeIcon :icon="faAngleLeft" />
            </button>
        </div>

        <div class="next_button_wrapper">
            <button class="nav-next glass" @click="swiperRef?.slideNext()">
                <FontAwesomeIcon :icon="faAngleRight" />
            </button>
        </div>

    </div>
</template>

<style scoped>
.swiper{
    width: 100%;
    height: 250px;
    min-width: 0;
    margin: 15px 0;
}

.slider_wrapper{
    position: relative;
    overflow-x: hidden;
}

.nav-prev, .nav-next {
    font-size: 24px;
    color: white;
    height: 50px;
    width: 50px;
    cursor: pointer;
}

.prev_button_wrapper{
    z-index: 99;
    position: absolute;
    top: 50%;
    left: 15px;
}

.next_button_wrapper{
    z-index: 99;
    position: absolute;
    top: 50%;
    right: 15px;
}

img {
    width: 100%;
    height: 250px;
    object-fit: cover;
}

:deep(.swiper-slide) {
    position: relative;
}

.slider_button {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    bottom: 20px;
    right: 40px;
    z-index: 999;
    width: fit-content;
    padding: 0 15px;
    height: 60px;
    font-size: 24px;
    color: white;
    cursor: pointer;
    text-decoration: none;
}

:deep(.swiper-pagination-bullet) {
    background: #5774B8;
    bottom: -50px;
}

:deep(.swiper-pagination-bullet-active) {
    background: #5774B8;
    opacity: 1;
}

@media screen and (min-width: 992px){
    .swiper{
        height: 400px;
    }
    img{
        height: 400px;
    }
}

@media screen and (min-width: 1510px){
    .swiper{
        height: 400px;
    }
    img{
        height: 400px;
    }
}
</style>