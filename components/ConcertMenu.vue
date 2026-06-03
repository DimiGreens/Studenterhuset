<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faAngleDown,
  faAngleRight,
  faAngleLeft,
  faExpand,
  faXmark,
  faBars,
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

const filterOpen = ref(false);
const dateInput = ref(null);
const datePicker = ref(null);
const selectedDate = ref(null);
const openId = ref(null);
const contentRefs = ref({});
const selectedGenre = ref("all");
const selectedConcert = ref(null);
const sliderConcert = ref(null);
const sliderIndex = ref(0);

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

onMounted(() => {
  if (dateInput.value) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const concertDates = new Set(
      props.concert
        .filter((c) => {
          if (!c.date) return false;
          const [day, month, year] = c.date.split("/");
          return new Date(year, month - 1, day) >= today;
        })
        .map((c) => c.date),
    );

    datePicker.value = flatpickr(dateInput.value, {
      dateFormat: "d/m/Y",
      onChange: (selectedDates, dateStr) => {
        selectedDate.value = dateStr;
      },
      onDayCreate: (dObj, dStr, fp, dayElem) => {
        const d = dayElem.dateObj;
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        const formatted = `${day}/${month}/${year}`;

        if (concertDates.has(formatted)) {
          const dot = document.createElement("span");
          dot.classList.add("event-dot");
          dayElem.appendChild(dot);
        }
      },
    });
  }

  const prices = props.concert.map((c) => c.price).filter((p) => p != null);
  if (prices.length) {
    minPrice.value = Math.min(...prices);
    maxPrice.value = Math.max(...prices);
    priceRange.value = [minPrice.value, maxPrice.value];
  }
});

onUnmounted(() => {
  document.body.style.overflow = "";
});

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

const resetFilters = () => {
  selectedGenre.value = "all";
  selectedDate.value = null;
  datePicker.value?.clear();
  priceRange.value = [minPrice.value, maxPrice.value];
};

function toSpotifyEmbed(url) {
  if (!url) return null;
  return url.replace("open.spotify.com/", "open.spotify.com/embed/");
}

function handleClick(item) {
  if (window.innerWidth >= 993) {
    openModal(item);
  }
}
</script>

<template>
  <div class="concert-section container container--lg">
    <button class="filter_toggle glass" @click="filterOpen = !filterOpen">
      <span>Filter</span>
      <FontAwesomeIcon :icon="filterOpen ? faXmark : faBars" />
    </button>

    <div class="filter_panel glass" :class="{ open: filterOpen }">
      <div class="filter_panel_header">
        <p>Filter</p>
        <button class="filter_close glass" @click="filterOpen = false">
          <FontAwesomeIcon :icon="faXmark" />
        </button>
      </div>

      <select v-model="selectedGenre" class="filter_select glass">
        <option value="all">Alle genrer</option>
        <option v-for="genre in availableGenres" :key="genre" :value="genre">
          {{ genre }}
        </option>
      </select>

      <input
        ref="dateInput"
        class="filter_select glass"
        placeholder="Alle datoer"
        readonly
      />

      <div class="price_slider">
        <p class="price_label">{{ priceRange[0] }},- – {{ priceRange[1] }},-</p>
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

    <div class="card_wrapper">
      <div
        v-for="item in filteredConcert"
        :key="item.id"
        class="concert"
        @click="handleClick(item)"
      >
        <div class="concert_image">
          <img :src="item.bandImage" alt="" />
          <span class="concert_genre_tag">{{ item.genre }}</span>
          <div class="concert_button_wrapper">
            <button class="concert_button glass" @click.stop="toggle(item.id)">
              <FontAwesomeIcon
                :icon="faAngleDown"
                :class="{ rotated: openId === item.id }"
              />
            </button>
          </div>
        </div>

        <div class="concert_info">
          <p class="band_cardName">{{ item.bandName }}</p>
          <div class="band_dateAndPrice" v-show="openId !== item.id">
            <p class="band_cardDate">{{ item.date }}</p>
            <p class="band_cardPrice">{{ item.price }},-</p>
          </div>
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
              : { maxHeight: '0px', paddingBottom: '0px' }
          "
        >
          <div class="mobile_infobox">
            <div class="infoText">
              <p>Dato:</p>
              <p>{{ item.date }}</p>
            </div>
            <div class="infoText">
              <p>Genre:</p>
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
          </div>
          <p class="band_info_box">{{ item.bandDescription }}</p>
          <iframe
            v-if="item.spotifyEmbed"
            :src="toSpotifyEmbed(item.spotifyEmbed)"
            width="100%"
            height="200"
            frameborder="0"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media"
          />
          <div class="button_wrapper">
            <button class="glass ticket_button">Køb billet</button>
          </div>
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
                <div class="concert_info modal_info">
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
                  <span class="glass">
                    {{ item.bandName }}
                    <FontAwesomeIcon
                      :icon="faAngleRight"
                      class="sidebar_icon"
                    />
                  </span>
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
</template>

<style scoped>
.concert {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.concert:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.concert_image {
  position: relative;
  overflow: hidden;
}

.concert_image img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.3s ease;
}

.concert:hover .concert_image img {
  transform: scale(1.05);
}

.concert_genre_tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(176, 192, 235, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 100px;
  padding: 4px 14px;
  font-size: 14px;
  color: #111;
  font-family: "Barlow Condensed", sans-serif;
}

.concert_button_wrapper {
  position: absolute;
  bottom: 12px;
  right: 12px;
}

.concert_button {
  width: 48px;
  height: 48px;
  background: #5774b8 !important;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: white;
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }
}

.rotated {
  transform: rotate(180deg);
}

.concert_info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  background: #eeeeff;

  .band_cardName {
    color: #0b1071;
    font-family: "Barlow Condensed", sans-serif;
    font-size: 32px;
    font-weight: bold;
  }

  .band_dateAndPrice {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 15px;

    .band_cardDate {
      font-family: "Barlow Condensed", sans-serif;
      color: #535353;
      font-size: 16px;
    }

    .band_cardPrice {
      font-family: "Barlow Condensed", sans-serif;
      font-size: 20px;
      color: #535353;
      font-weight: 600;
    }
  }
}

.concert_content {
  overflow: hidden;
  transition:
    max-height 0.3s ease,
    padding 0.3s ease;
  background-color: #eeeeff;
  padding: 0 20px;
}

.mobile_infobox {
  background-color: #eeeeff;
  row-gap: 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  p {
    color: #111;
  }
}

.infoText {
  width: 100%;
  margin-bottom: 10px;

  p:first-child {
    font-size: 13px;
    font-weight: 700;
    color: #5774b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: "Barlow Condensed", sans-serif;
  }

  p:last-child {
    font-size: 18px;
    font-weight: 500;
    color: #111;
    font-family: "Barlow Condensed", sans-serif;
  }
}

.band_info_box {
  font-family: "Inter", sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  padding: 15px 0;
}

.ticket_button {
  background: #5774b8;
  color: white;
  font-size: 18px;
  padding: 12px 24px;
  border-radius: 100px;
  border: none;
  cursor: pointer;
  font-family: "Barlow Condensed", sans-serif;
  margin-top: 8px;
  margin-bottom: 16px;
}

.button_wrapper {
  display: flex;
  justify-content: center;
}

.filter_toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 50px;
  padding: 0 24px;
  font-size: 20px;
  color: white;
  font-family: "Barlow Condensed", sans-serif;
  cursor: pointer;
  border: none;
  margin: 20px 0;

  svg {
    width: 20px;
    height: 20px;
  }
}

.filter_panel {
  display: none;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 16px;
}

.filter_panel.open {
  display: flex;
}

.filter_panel_header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    font-size: 24px;
    font-family: "Barlow Condensed", sans-serif;
    color: white;
  }
}

.filter_close {
  width: 44px;
  height: 44px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }
}

.filter_select {
  width: 100%;
  height: 56px;
  font-size: 20px;
  color: white;
  padding: 0 20px;
  cursor: pointer;
  border: none;
  outline: none;
  font-family: "Barlow Condensed", sans-serif;
  background: rgba(87, 116, 184, 0.6);
}

.price_label {
  color: white;
  font-size: 18px;
  font-family: "Barlow Condensed", sans-serif;
  margin-bottom: 8px;
}

.reset_button {
  height: 50px;
  padding: 0 20px;
  color: white;
  font-size: 18px;
  font-family: "Barlow Condensed", sans-serif;
  cursor: pointer;
  border: none;
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

.range_track input[type="range"]::-webkit-slider-thumb {
  pointer-events: all;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  margin-top: -8px;
  border: 3px solid #5774b8;
}

.range_track input[type="range"]::-webkit-slider-runnable-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 2px;
}

.range_track input[type="range"]::-moz-range-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 2px;
}

@media (min-width: 993px) {
  .filter_toggle {
    display: none;
  }

  .concert {
    overflow: hidden;
  }

  .filter_panel {
    display: flex !important;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    border-radius: 100px;
    padding: 12px 24px;
    gap: 20px;
    margin-bottom: 30px;
  }

  .filter_panel_header {
    display: none;
  }

  .filter_select {
    width: auto;
    min-width: 180px;
    height: 50px;
  }

  .price_slider {
    min-width: 220px;
  }

  .concert_button_wrapper {
    display: none;
  }

  .concert_content {
    max-height: 0 !important;
    overflow: visible !important;
    padding: 0 20px 20px !important;
    display: none;
  }

  .band_dateAndPrice {
    display: flex !important;
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

  .modal_info {
    padding: 30px;
    flex-direction: column;
    height: auto;
    min-width: 300px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    background: #eeeeff;
    max-height: none !important;
    overflow: visible !important;

    .button_wrapper {
      width: 100%;
      justify-content: center;
    }
  }
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
</style>
