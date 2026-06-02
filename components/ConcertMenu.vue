<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faAngleLeft,
  faExpand,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const props = defineProps({
  concert: {
    type: Array,
    default: () => [],
  },
});

const concerts = computed(() => props.concert);

const dateInput = ref(null);
const selectedDate = ref(null);
const openId = ref(null);
const contentRefs = ref({});
const selectedGenre = ref("all");
const selectedConcert = ref(null);
const sliderConcert = ref(null);
const sliderIndex = ref(0);
const windowWidth = ref(
  typeof window !== "undefined" ? window.innerWidth : 1024,
);

const priceRange = ref([0, 500]);
const minPrice = ref(0);
const maxPrice = ref(500);

const availableGenres = computed(() => {
  const genres = props.concert.map((c) => c.genre).filter(Boolean);
  return [...new Set(genres)].sort();
});

const hasActiveFilters = computed(
  () =>
    selectedGenre.value !== "all" ||
    selectedDate.value !== null ||
    priceRange.value[0] !== minPrice.value ||
    priceRange.value[1] !== maxPrice.value,
);

function clampMin() {
  if (priceRange.value[0] > priceRange.value[1])
    priceRange.value[0] = priceRange.value[1];
}
function clampMax() {
  if (priceRange.value[1] < priceRange.value[0])
    priceRange.value[1] = priceRange.value[0];
}

const openSlider = (item, startIndex = 0) => {
  sliderConcert.value = {
    ...item,
    bandImages: [item.bandImage, ...item.bandImages],
  };
  sliderIndex.value = startIndex;
};
const closeSlider = () => (sliderConcert.value = null);
const prevSlide = () =>
  (sliderIndex.value =
    (sliderIndex.value - 1 + sliderConcert.value.bandImages.length) %
    sliderConcert.value.bandImages.length);
const nextSlide = () =>
  (sliderIndex.value =
    (sliderIndex.value + 1) % sliderConcert.value.bandImages.length);

const toggle = (id) => {
  openId.value = openId.value === id ? null : id;
};

const filteredConcert = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let result = concerts.value.filter((item) => {
    if (!item.date) return false;
    const [day, month, year] = item.date.split("/");
    const concertDate = new Date(year, month - 1, day);
    return concertDate >= today;
  });

  if (selectedGenre.value !== "all") {
    result = result.filter((item) => item.genre === selectedGenre.value);
  }

  if (selectedDate.value) {
    result = result.filter((item) => item.date === selectedDate.value);
  }

  result = result.filter(
    (item) =>
      item.price >= priceRange.value[0] && item.price <= priceRange.value[1],
  );

  return result;
});

const onResize = () => (windowWidth.value = window.innerWidth);
onMounted(() => window.addEventListener("resize", onResize));
onUnmounted(() => {
  window.removeEventListener("resize", onResize);
  document.body.style.overflow = "";
});

const isDesktop = computed(() => windowWidth.value > 992);

const openModal = (item) => {
  selectedConcert.value = item;
  document.body.style.overflow = "hidden";
};
const closeModal = () => {
  selectedConcert.value = null;
  document.body.style.overflow = "";
};

const otherConcerts = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return concerts.value.filter((item) => {
    if (item.id === selectedConcert.value?.id) return false;
    if (item.genre !== selectedConcert.value?.genre) return false;
    if (!item.date) return false;

    const [day, month, year] = item.date.split("/");
    const concertDate = new Date(year, month - 1, day);
    return concertDate >= today;
  });
});

const datePicker = ref(null);

onMounted(() => {
  datePicker.value = flatpickr(dateInput.value, {
    dateFormat: "d/m/Y",
    onChange: (selectedDates, dateStr) => {
      selectedDate.value = dateStr;
    },
  });

  const prices = props.concert.map((c) => c.price).filter((p) => p != null);
  if (prices.length) {
    minPrice.value = Math.min(...prices);
    maxPrice.value = Math.max(...prices);
    priceRange.value = [minPrice.value, maxPrice.value];
  }
});

const resetFilters = () => {
  selectedGenre.value = "all";
  selectedDate.value = null;
  datePicker.value.clear();
  priceRange.value = [minPrice.value, maxPrice.value];
};

function toSpotifyEmbed(url) {
  if (!url) return null
  return url.replace('open.spotify.com/', 'open.spotify.com/embed/')
}
</script>

<template>
  <div class="concert-section container container--lg">
    <div class="filter_wrapper">
      <!-- Genre dropdown -->
      <select v-model="selectedGenre" class="glass">
        <option value="all">Alle genrer</option>
        <option v-for="genre in availableGenres" :key="genre" :value="genre">
          {{ genre }}
        </option>
      </select>

      <!-- Dato -->
      <input ref="dateInput" class="glass" placeholder="Alle datoer" readonly />

      <!-- Pris slider -->
      <div class="price_slider">
        <p class="price_label">{{ priceRange[0] }}kr – {{ priceRange[1] }}kr</p>
        <div class="range_track">
          <input
            type="range"
            :min="minPrice"
            :max="maxPrice"
            v-model.number="priceRange[0]"
            @input="clampMin"
          />
          <input
            type="range"
            :min="minPrice"
            :max="maxPrice"
            v-model.number="priceRange[1]"
            @input="clampMax"
          />
        </div>
      </div>

      <button
        v-if="hasActiveFilters"
        class="glass reset_button"
        @click="resetFilters"
      >
        Nulstil filtre
      </button>
    </div>

    <div v-if="!isDesktop" class="card_wrapper">
      <div v-for="item in filteredConcert" :key="item.id" class="concert">
        <div class="band_name">
          <p>{{ item.bandName }}</p>
        </div>
        <div class="concert_image">
          <img :src="item.bandImage" alt="" />

          <div class="concert_button_wrapper">
            <button class="concert_button glass" @click="toggle(item.id)">
              <FontAwesomeIcon
                :icon="faAngleDown"
                :class="{ rotated: openId === item.id }"
              />
            </button>
          </div>
        </div>

        <div class="concert_info">
          <p>{{ item.genre }}</p>
          <p>{{ item.date }}</p>
          <p>{{ item.price }},-</p>
        </div>

        <div
          :ref="
            (el) => {
              if (el) contentRefs[item.id] = el;
            }
          "
          class="concert_content"
          :style="
            openId === item.id
              ? {
                  maxHeight: contentRefs[item.id]?.scrollHeight + 'px',
                  paddingBottom: '20px',
                }
              : {
                  maxHeight: '0px',
                  paddingBottom: '0px',
                }
          "
        >
          <p class="band_info_box">
            {{ item.bandDescription }}
          </p>
          <iframe
            v-if="item.spotifyEmbed"
            :src="toSpotifyEmbed(item.spotifyEmbed)"
            width="100%"
            height="200"
            frameborder="0"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media"
          />
          <div class="mobile_infobox">
            <div class="infoText">
              <p>Dato:</p>
              <p>{{ item.date }}</p>
            </div>
            <div class="infoText">
              <p>genre:</p>
              <p>{{ item.genre }}</p>
            </div>
            <div class="infoText">
              <p>Koncert start:</p>
              <p>{{ item.concertStart }}</p>
            </div>
            <div class="infoText">
              <p>Døre åbner:</p>
              <p>{{ item.doorsOpen }}</p>
            </div>
            <div class="infoText">
              <p>Venue:</p>
              <p>{{ item.venue }}</p>
            </div>
            <div class="infoText">
              <p>Pris:</p>
              <p>{{ item.price }},-</p>
            </div>
            <div class="button_wrapper">
              <button class="glass ticket_button">Køb billet</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isDesktop" class="card_wrapper">
      <div
        v-for="item in filteredConcert"
        :key="item.id"
        class="concert"
        @click="openModal(item)"
      >
        <div class="band_name">
          <p>{{ item.bandName }}</p>
        </div>
        <div class="concert_image">
          <img :src="item.bandImage" alt="" />
        </div>

        <div class="concert_info">
          <p>{{ item.genre }}</p>
          <p>{{ item.date }}</p>
          <p>{{ item.price }},-</p>
        </div>

        <div
          :ref="
            (el) => {
              if (el) contentRefs[item.id] = el;
            }
          "
          class="concert_content"
          :style="
            openId === item.id
              ? {
                  maxHeight: contentRefs[item.id]?.scrollHeight + 'px',
                  paddingBottom: '20px',
                }
              : {
                  maxHeight: '0px',
                  paddingBottom: '0px',
                }
          "
        >
          <p class="band_info_box">
            {{ item.bandDescription }}
          </p>
          <iframe
            v-if="item.spotifyEmbed"
            :src="toSpotifyEmbed(item.spotifyEmbed)"
            width="100%"
            height="152"
            frameborder="0"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media"
          />
          <div class="button_wrapper">
            <button class="glass ticket_button">Køb billet</button>
          </div>
        </div>
      </div>

      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="selectedConcert"
            class="modal_backdrop"
            @click.self="closeModal"
          >
            <div class="modal_container">
              <div class="modal">
                <div class="image_wrapper">
                  <button class="modal_close glass" @click="closeModal">
                    <FontAwesomeIcon :icon="faXmark" />
                  </button>
                  <button
                    class="modal_band-gallery glass"
                    @click.stop="openSlider(selectedConcert, 0)"
                  >
                    <FontAwesomeIcon :icon="faExpand" />
                  </button>
                  <img
                    :src="selectedConcert.bandImage"
                    alt=""
                    class="modal_image"
                  />
                </div>
                <div class="opened_modal_bandbox">
                  <div class="band_detail">
                    <h2>{{ selectedConcert.bandName }}</h2>
                    <p class="band_info_box">
                      {{ selectedConcert.bandDescription }}
                    </p>
                    <iframe
                      v-if="selectedConcert.spotifyEmbed"
                      :src="toSpotifyEmbed(selectedConcert.spotifyEmbed)"
                      width="100%"
                      height="152"
                      frameborder="0"
                      loading="lazy"
                      allow="autoplay; clipboard-write; encrypted-media"
                    />
                  </div>
                  <div class="concert_info">
                    <div class="infoText">
                      <p>Dato:</p>
                      <p>{{ selectedConcert.date }}</p>
                    </div>
                    <div class="infoText">
                      <p>Genre:</p>
                      <p>{{ selectedConcert.genre }}</p>
                    </div>
                    <div class="infoText">
                      <p>Koncert start:</p>
                      <p>{{ selectedConcert.concertStart }}</p>
                    </div>
                    <div class="infoText">
                      <p>Døre åbner:</p>
                      <p>{{ selectedConcert.doorsOpen }}</p>
                    </div>
                    <div class="infoText">
                      <p>Venue:</p>
                      <p>{{ selectedConcert.venue }}</p>
                    </div>
                    <div class="infoText">
                      <p>Pris:</p>
                      <p>{{ selectedConcert.price }},-</p>
                    </div>
                    <div class="button_wrapper">
                      <button class="glass ticket_button">Køb billet</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal_sidebar">
                <h3>Andre {{ selectedConcert.genre }} koncerter</h3>
                <p
                  v-if="otherConcerts.length === 0"
                  style="color: white; font-size: 14px"
                >
                  Ingen andre {{ selectedConcert.genre }} koncerter
                </p>
                <div
                  v-for="item in otherConcerts"
                  :key="item.id"
                  class="sidebar_concert"
                  @click="openModal(item)"
                >
                  <img :src="item.bandImage" />
                  <div class="sidebar_overlay">
                    <span class="glass"
                      >{{ item.bandName }}
                      <FontAwesomeIcon
                        :icon="faAngleRight"
                        class="sidebar_icon"
                    /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="sliderConcert"
            class="modal_backdrop"
            @click.self="closeSlider"
          >
            <div class="slider_container">
              <button class="modal_close glass" @click="closeSlider">
                <FontAwesomeIcon :icon="faXmark" />
              </button>

              <button class="slider_arrow left glass" @click="prevSlide">
                <FontAwesomeIcon :icon="faAngleLeft" />
              </button>

              <img
                :src="sliderConcert.bandImages[sliderIndex]"
                class="slider_image"
              />

              <button class="slider_arrow right glass" @click="nextSlide">
                <FontAwesomeIcon :icon="faAngleRight" />
              </button>

              <div class="slider_dots">
                <span
                  v-for="(_, i) in sliderConcert.bandImages"
                  :key="i"
                  :class="['dot', { active: i === sliderIndex }]"
                  @click="sliderIndex = i"
                />
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<style scoped>
.mobile_infobox {
  padding: 30px;
  background-color: #5774b8;
  border-radius: 8px;

  .button_wrapper {
    width: 100%;
    justify-content: center;
    margin: 0 auto;
  }

  p {
    color: white;
  }
}

.filter_wrapper {
  display: flex;
  align-items: flex-start;
  gap: 30px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.filter_wrapper select,
.filter_wrapper input,
.filter_wrapper button {
  height: 50px;
  font-size: 20px;
  color: white;
  padding: 0 20px;
  cursor: pointer;
  border: none;
  outline: none;
}

.filter_wrapper input.glass {
  overflow: visible;
}

.reset_button {
  color: white;
  font-size: 20px;
  padding: 0 20px;
  cursor: pointer;
  align-self: center;
}

#genre_selector {
  color: white;
  width: 150px;
  font-size: 24px;
  margin-top: 30px;
}

/* Genre checkboxes — samme udseende som originalen */
.genre_checkboxes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox_label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.checkbox_label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #5774b8;
  cursor: pointer;
}

/* Pris slider */
.price_slider {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
  align-self: center;
}

.price_label {
  font-size: 18px;
  margin: 0;
}

.range_track {
  position: relative;
  height: 2rem;
}

.range_track input[type="range"] {
  position: absolute;
  width: 100%;
  pointer-events: none;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  top: 50%;
  transform: translateY(-50%);
}

.range_track input[type="range"]::-webkit-slider-runnable-track {
  height: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.range_track input[type="range"]::-webkit-slider-thumb {
  pointer-events: all;
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #5774b8;
  cursor: pointer;
  margin-top: -8px;
  border: none;
}

.range_track input[type="range"]::-moz-range-thumb {
  pointer-events: all;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #5774b8;
  cursor: pointer;
  border: none;
}

.concert {
  margin-bottom: 30px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.band_name > p {
  font-size: 24px;
  margin: 15px 0;
}

.concert_button_wrapper {
  position: absolute;
  bottom: 10px;
  right: 10px;

  .concert_button {
    width: 50px;
    height: 50px;

    svg {
      width: 35px;
      height: 35px;
      color: white;
      transition: transform 0.3s ease;
    }
  }
}

.modal_backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.modal_container {
  display: flex;
  gap: 15px;
  max-height: 85vh;
  width: min(1400px, 95vw);
  overflow-y: auto;
}

.modal {
  flex: 1;
  overflow-y: auto;
  max-height: 85vh;
}

.modal_sidebar {
  width: 220px;
  overflow-y: auto;
  flex-shrink: 0;

  h3 {
    color: white;
    margin-bottom: 15px;
  }
}

.sidebar_concert {
  position: relative;
  cursor: pointer;
  margin-bottom: 10px;

  img {
    width: 100%;
    height: 130px;
    object-fit: cover;
    display: block;
  }

  .sidebar_overlay {
    position: absolute;
    bottom: 10px;
    left: 10px;
  }

  span {
    color: white;
    font-size: 14px;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    gap: 0px;
    border-radius: 20px;
    transition: gap 0.2s ease;
  }

  .sidebar_icon {
    width: 14px;
    height: 14px;
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    transition:
      max-width 0.2s ease,
      opacity 0.2s ease;
  }

  &:hover span {
    gap: 6px;
  }

  &:hover .sidebar_icon {
    max-width: 14px;
    opacity: 1;
  }
}

.modal_image {
  display: block;
  width: 100%;
  height: clamp(200px, 40vh, 500px);
  object-fit: cover;
  object-position: center;
}

.image_wrapper {
  position: relative;
  overflow: visible;
}

.modal_close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  z-index: 10;
}

.opened_modal_bandbox {
  display: flex;
  align-items: stretch;

  .band_detail {
    background-color: white;
    padding: 30px;
    flex: 1;
  }

  .concert_info {
    padding: 30px;
    flex-direction: column;
    height: auto;
    min-width: 300px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    .button_wrapper {
      width: 100%;
      justify-content: center;
    }
  }
}

.infoText {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 15px;
}

.rotated {
  transform: rotate(180deg);
}

.concert_image {
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 250px;
    object-position: center;
    object-fit: cover;
    transition: transform 0.3s ease;
    display: block;
  }
}

.concert:hover .concert_image img {
  transform: scale(1.1);
}

.concert_info {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 18px;
  color: white;
  background-color: #5774b8;
  height: 50px;
}

.concert_content {
  overflow: hidden;
  transition:
    max-height 0.3s ease,
    padding 0.3s ease;
}

.band_info_box {
  padding: 15px 0;
}

.button_wrapper {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

.ticket_button {
  color: white;
  font-size: 18px;
  padding: 15px;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.slider_container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.slider_image {
  max-height: 90vh;
  max-width: 90vw;
  object-fit: contain;
}

.slider_arrow {
  color: white;
  font-size: 18px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  flex-shrink: 0;
}

.slider_dots {
  position: absolute;
  bottom: -30px;
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: background 0.2s ease;
}

.dot.active {
  background: white;
}

.modal_band-gallery {
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  z-index: 10;
}

@media (max-width: 992px) {
  .filter_wrapper {
    flex-wrap: wrap;
  }

  .filter_wrapper select,
  .filter_wrapper input,
  .filter_wrapper button {
    flex: 1;
    min-width: 140px;
  }
}
</style>