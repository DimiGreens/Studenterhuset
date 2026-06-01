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

/**
 * GENERISK DATA
 * Kan være concerts eller events
 */
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

/**
 * UI STATE
 */
const openId = ref(null);
const contentRefs = ref({});
const selectedDate = ref(null);

const selectedItem = ref(null);
const sliderItem = ref(null);
const sliderIndex = ref(0);

const windowWidth = ref(
  typeof window !== "undefined" ? window.innerWidth : 1024,
);

/**
 * HELPERS (gør komponenten genbrugelig)
 */
const getTitle = (item) => item.bandName || item.title;
const getImage = (item) => item.bandImage || item.image;
const getGenre = (item) => item.genre;
const getPrice = (item) => item.price;
const getVenue = (item) => item.venue;

/**
 * FILTER (dato + genre hvis findes)
 */
const selectedGenre = ref("all");

const filteredItems = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let result = props.items.filter((item) => {
    if (!item.date) return true;

    const [day, month, year] = item.date.split("/");
    const date = new Date(year, month - 1, day);

    return date >= today;
  });

  if (selectedGenre.value !== "all") {
    result = result.filter((item) => item.genre === selectedGenre.value);
  }

  if (selectedDate.value) {
    result = result.filter((item) => item.date === selectedDate.value);
  }

  return result;
});

/**
 * TOGGLE CARD
 */
const toggle = (id) => {
  openId.value = openId.value === id ? null : id;
};

/**
 * MODAL
 */
const openModal = (item) => {
  selectedItem.value = item;
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  selectedItem.value = null;
  document.body.style.overflow = "";
};

/**
 * SLIDER
 */
const openSlider = (item, startIndex = 0) => {
  sliderItem.value = {
    ...item,
    images: item.images || [getImage(item)],
  };

  sliderIndex.value = startIndex;
};

const closeSlider = () => (sliderItem.value = null);

const prevSlide = () =>
  (sliderIndex.value =
    (sliderIndex.value - 1 + sliderItem.value.images.length) %
    sliderItem.value.images.length);

const nextSlide = () =>
  (sliderIndex.value =
    (sliderIndex.value + 1) % sliderItem.value.images.length);

/**
 * RESPONSIVE
 */
const onResize = () => (windowWidth.value = window.innerWidth);

onMounted(() => {
  window.addEventListener("resize", onResize);

  const dateInput = document.querySelector("#dateInput");

  if (dateInput) {
    flatpickr(dateInput, {
      dateFormat: "d/m/Y",
      onChange: (_, dateStr) => {
        selectedDate.value = dateStr;
      },
    });
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
  document.body.style.overflow = "";
});

const isDesktop = computed(() => windowWidth.value > 992);

/**
 * OTHER ITEMS (sidebar)
 */
const otherItems = computed(() => {
  if (!selectedItem.value) return [];

  return props.items.filter((item) => {
    if (item.id === selectedItem.value.id) return false;
    if (item.genre !== selectedItem.value.genre) return false;
    return true;
  });
});

const resetFilters = () => {
  selectedGenre.value = "all";
  selectedDate.value = null;
};
</script>

<template>
  <div class="concert-section container container--lg">
    <!-- FILTER -->
    <div class="filter_wrapper">
      <select v-model="selectedGenre" class="glass">
        <option value="all">All genres</option>
        <option value="pop">Pop</option>
        <option value="rock">Rock</option>
        <option value="metal">Metal</option>
      </select>

      <input id="dateInput" class="glass" placeholder="All dates" readonly />

      <button
        v-if="selectedGenre !== 'all' || selectedDate"
        class="glass reset_button"
        @click="resetFilters"
      >
        Nulstil filtre
      </button>
    </div>

    <!-- LIST -->
    <div class="concert_wrapper">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="concert"
        @click="isDesktop ? openModal(item) : toggle(item.id)"
      >
        <div class="band_name">
          <p>{{ getTitle(item) }}</p>
        </div>

        <div class="concert_image">
          <img :src="getImage(item)" />

          <div class="concert_button_wrapper" v-if="!isDesktop">
            <button class="concert_button glass" @click.stop="toggle(item.id)">
              <FontAwesomeIcon
                :icon="faAngleDown"
                :class="{ rotated: openId === item.id }"
              />
            </button>
          </div>
        </div>

        <div class="concert_info">
          <p>{{ getGenre(item) }}</p>
          <p>{{ item.date }}</p>
          <p>{{ getPrice(item) }},-</p>
        </div>

        <!-- EXPAND MOBILE -->
        <div
          class="concert_content"
          :ref="(el) => el && (contentRefs[item.id] = el)"
          :style="
            openId === item.id
              ? {
                  maxHeight: contentRefs[item.id]?.scrollHeight + 'px',
                  paddingBottom: '20px',
                }
              : { maxHeight: '0px', paddingBottom: '0px' }
          "
        >
          <p class="band_info_box">
            {{ item.description }}
          </p>

          <div class="button_wrapper">
            <button class="glass ticket_button">Køb billet</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL (DESKTOP) -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedItem"
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
                  @click.stop="openSlider(selectedItem, 0)"
                >
                  <FontAwesomeIcon :icon="faExpand" />
                </button>

                <img :src="getImage(selectedItem)" class="modal_image" />
              </div>

              <div class="opened_modal_bandbox">
                <div class="band_detail">
                  <h2>{{ getTitle(selectedItem) }}</h2>
                  <p class="band_info_box">
                    {{ selectedItem.description }}
                  </p>
                </div>

                <div class="concert_info">
                  <div class="infoText">
                    <p>Dato:</p>
                    <p>{{ selectedItem.date }}</p>
                  </div>
                  <div class="infoText">
                    <p>Genre:</p>
                    <p>{{ getGenre(selectedItem) }}</p>
                  </div>
                  <div class="infoText">
                    <p>Venue:</p>
                    <p>{{ getVenue(selectedItem) }}</p>
                  </div>

                  <div class="button_wrapper">
                    <button class="glass ticket_button">Køb billet</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal_sidebar">
              <h3>Andre {{ getGenre(selectedItem) }} events</h3>

              <div
                v-for="item in otherItems"
                :key="item.id"
                class="sidebar_concert"
                @click="openModal(item)"
              >
                <img :src="getImage(item)" />

                <div class="sidebar_overlay">
                  <span class="glass">
                    {{ getTitle(item) }}
                    <FontAwesomeIcon :icon="faAngleRight" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
