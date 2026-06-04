<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faAngleLeft,
  faExpand,
  faXmark,
  faRotate,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
});

const allEvents = computed(() => props.events);

const filterOpen = ref(false);
const dateInput = ref(null);
const datePicker = ref(null);
const selectedDate = ref(null);
const selectedKategori = ref("all");
const openId = ref(null);
const contentRefs = ref({});
const selectedEvent = ref(null);
const sliderEvent = ref(null);
const sliderIndex = ref(0);
const searchQuery = ref("");

const priceRange = ref([0, 500]);
const minPrice = ref(0);
const maxPrice = ref(500);

const availableKategorier = computed(() => {
  const kategorier = props.events
    .filter((e) => !e.fastBegivenhed)
    .map((e) => e.kategori)
    .filter(Boolean);
  return [...new Set(kategorier)].sort();
});

const hasActiveFilters = computed(
  () =>
    selectedKategori.value !== "all" ||
    selectedDate.value !== null ||
    searchQuery.value.trim() !== "" ||
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
  sliderEvent.value = { ...item };
  sliderIndex.value = startIndex;
};
const closeSlider = () => (sliderEvent.value = null);
const prevSlide = () =>
  (sliderIndex.value =
    (sliderIndex.value - 1 + sliderEvent.value.billeder.length) %
    sliderEvent.value.billeder.length);
const nextSlide = () =>
  (sliderIndex.value =
    (sliderIndex.value + 1) % sliderEvent.value.billeder.length);

const toggle = (id) => {
  openId.value = openId.value === id ? null : id;
};

const fasteBegivenheder = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return allEvents.value.filter((item) => {
    if (!item.fastBegivenhed) return false;
    if (!item.dato) return false;
    const [day, month, year] = item.dato.split("/");
    return new Date(year, month - 1, day) >= today;
  });
});

const enkeltBegivenheder = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let result = allEvents.value.filter((item) => {
    if (item.fastBegivenhed) return false;
    if (!item.dato) return false;
    const [day, month, year] = item.dato.split("/");
    return new Date(year, month - 1, day) >= today;
  });

   if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((item) =>
      [item.titel, item.kategori].some((field) =>
        field?.toLowerCase().includes(q)
      )
    );
  }

  if (selectedKategori.value !== "all") {
    result = result.filter((item) => item.kategori === selectedKategori.value);
  }

  if (selectedDate.value) {
    result = result.filter((item) => item.dato === selectedDate.value);
  }

  result = result.filter(
    (item) =>
      (item.pris ?? 0) >= priceRange.value[0] &&
      (item.pris ?? 0) <= priceRange.value[1],
  );

  return result;
});

onMounted(() => {
  if (dateInput.value) {
    const eventDates = new Set(
      props.events.filter((e) => !e.fastBegivenhed).map((e) => e.dato),
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

        if (eventDates.has(formatted)) {
          const dot = document.createElement("span");
          dot.classList.add("event-dot");
          dayElem.appendChild(dot);
        }
      },
    });

    const route = useRoute();
    if (route.query.open) {
      const match = allEvents.value.find((e) => e.id === route.query.open);
      if (match) openModal(match);
    }
  }

  const prices = props.events
    .filter((e) => !e.fastBegivenhed)
    .map((e) => e.pris)
    .filter((p) => p != null);
  if (prices.length) {
    minPrice.value = 0;
    maxPrice.value = Math.max(...prices);
    priceRange.value = [minPrice.value, maxPrice.value];
  }
});

onUnmounted(() => {
  document.body.style.overflow = "";
});

const openModal = (item) => {
  selectedEvent.value = item;
  document.body.style.overflow = "hidden";
};
const closeModal = () => {
  selectedEvent.value = null;
  document.body.style.overflow = "";
};

const otherEvents = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return allEvents.value.filter((item) => {
    if (item.id === selectedEvent.value?.id) return false;
    if (!item.dato) return false;
    const [day, month, year] = item.dato.split("/");
    return new Date(year, month - 1, day) >= today;
  });
});

const resetFilters = () => {
  selectedKategori.value = "all";
  selectedDate.value = null;
  datePicker.value?.clear();
  priceRange.value = [minPrice.value, maxPrice.value];
  searchQuery.value = "";
};

function handleClick(item) {
  if (window.innerWidth >= 993) {
    openModal(item);
  }
}
</script>

<template>
  <div class="event-section container container--lg">
    <section v-if="fasteBegivenheder.length > 0" class="event_section_group">
      <h2 class="section_heading">Faste begivenheder</h2>
      <div class="card_wrapper">
        <div
          v-for="item in fasteBegivenheder"
          :key="item.id"
          class="event"
          @click="handleClick(item)"
        >
          <div class="event_image">
            <img :src="item.billede" alt="" />
            <div class="event_button_wrapper">
              <button class="event_button glass" @click.stop="toggle(item.id)">
                <FontAwesomeIcon
                  :icon="faAngleDown"
                  :class="{ rotated: openId === item.id }"
                />
              </button>
            </div>
          </div>

          <div class="event_info">
            <p class="event_cardName">{{ item.titel }}</p>
            <div class="event_dateAndPrice" v-show="openId !== item.id">
              <p class="event_cardDate">{{ item.dato }}</p>
              <p class="event_cardPrice">
                {{ item.pris ? item.pris + ",-" : "Gratis" }}
              </p>
            </div>
          </div>

          <div
            :ref="
              (el) => {
                if (el) contentRefs[item.id] = el;
              }
            "
            class="event_content"
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
                <p>{{ item.dato }}</p>
              </div>
              <div class="infoText">
                <p>Tid:</p>
                <p>{{ item.tid }}</p>
              </div>
              <div class="infoText">
                <p>Venue:</p>
                <p>{{ item.venue }}</p>
              </div>
              <div class="infoText">
                <p>Pris:</p>
                <p>{{ item.pris ? item.pris + ",-" : "Gratis" }}</p>
              </div>
            </div>
            <p class="event_info_box">{{ item.beskrivelse }}</p>
            <div v-if="item.billetLink" class="button_wrapper">
              <a
                :href="item.billetLink"
                target="_blank"
                class="glass ticket_button"
                >Køb billet</a
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="event_section_group">
      <h2 class="section_heading">Kommende begivenheder</h2>

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

        <select v-model="selectedKategori" class="filter_select glass">
          <option value="all">Alle kategorier</option>
          <option v-for="kat in availableKategorier" :key="kat" :value="kat">
            {{ kat }}
          </option>
        </select>

        <input
          ref="dateInput"
          class="filter_select glass"
          placeholder="Alle datoer"
          readonly
        />

        <div class="price_slider">
          <p class="price_label">
            {{ priceRange[0] }},- – {{ priceRange[1] }},-
          </p>
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

        <input
        v-model="searchQuery"
        type="text"
        placeholder="Søg"
        class="filter_select glass"
        >

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
          v-for="item in enkeltBegivenheder"
          :key="item.id"
          class="event"
          @click="handleClick(item)"
        >
          <div class="event_image">
            <img :src="item.billede" alt="" />
            <span v-if="item.kategori" class="event_tag">{{
              item.kategori
            }}</span>
            <div class="event_button_wrapper">
              <button class="event_button glass" @click.stop="toggle(item.id)">
                <FontAwesomeIcon
                  :icon="faAngleDown"
                  :class="{ rotated: openId === item.id }"
                />
              </button>
            </div>
          </div>

          <div class="event_info">
            <p class="event_cardName">{{ item.titel }}</p>
            <div class="event_dateAndPrice" v-show="openId !== item.id">
              <p class="event_cardDate">{{ item.dato }}</p>
              <p class="event_cardPrice">
                {{ item.pris ? item.pris + ",-" : "Gratis" }}
              </p>
            </div>
          </div>

          <div
            :ref="
              (el) => {
                if (el) contentRefs[item.id] = el;
              }
            "
            class="event_content"
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
                <p>{{ item.dato }}</p>
              </div>
              <div class="infoText">
                <p>Tid:</p>
                <p>{{ item.tid }}</p>
              </div>
              <div class="infoText">
                <p>Venue:</p>
                <p>{{ item.venue }}</p>
              </div>
              <div class="infoText">
                <p>Pris:</p>
                <p>{{ item.pris ? item.pris + ",-" : "Gratis" }}</p>
              </div>
            </div>
            <p class="event_info_box">{{ item.beskrivelse }}</p>
            <div v-if="item.billetLink" class="button_wrapper">
              <a
                :href="item.billetLink"
                target="_blank"
                class="glass ticket_button"
                >Køb billet</a
              >
            </div>
          </div>
        </div>

        <p v-if="enkeltBegivenheder.length === 0" class="no_results">
          Ingen begivenheder matcher dine filtre.
        </p>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedEvent"
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
                  v-if="selectedEvent.billeder?.length > 1"
                  class="modal_event-gallery glass"
                  @click.stop="openSlider(selectedEvent, 0)"
                >
                  <FontAwesomeIcon :icon="faExpand" />
                </button>
                <img :src="selectedEvent.billede" alt="" class="modal_image" />
              </div>
              <div class="opened_modal_eventbox">
                <div class="event_detail">
                  <h2>
                    {{ selectedEvent.titel }}
                    <FontAwesomeIcon
                      v-if="selectedEvent.fastBegivenhed"
                      :icon="faRotate"
                      class="recurring_icon"
                      title="Fast begivenhed"
                    />
                  </h2>
                  <p class="event_info_box">{{ selectedEvent.beskrivelse }}</p>
                </div>
                <div class="event_info modal_info">
                  <div class="infoText">
                    <p>Dato:</p>
                    <p>{{ selectedEvent.dato }}</p>
                  </div>
                  <div class="infoText">
                    <p>Tid:</p>
                    <p>{{ selectedEvent.tid }}</p>
                  </div>
                  <div class="infoText">
                    <p>Venue:</p>
                    <p>{{ selectedEvent.venue }}</p>
                  </div>
                  <div class="infoText">
                    <p>Pris:</p>
                    <p>
                      {{
                        selectedEvent.pris
                          ? selectedEvent.pris + ",-"
                          : "Gratis"
                      }}
                    </p>
                  </div>
                  <div v-if="selectedEvent.billetLink" class="button_wrapper">
                    <a
                      :href="selectedEvent.billetLink"
                      target="_blank"
                      class="glass ticket_button"
                      >Køb billet</a
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="modal_sidebar">
              <h3>Andre begivenheder</h3>
              <p
                v-if="otherEvents.length === 0"
                style="color: white; font-size: 14px"
              >
                Ingen andre kommende begivenheder
              </p>
              <div
                v-for="item in otherEvents"
                :key="item.id"
                class="sidebar_event"
                @click="openModal(item)"
              >
                <img :src="item.billede" />
                <div class="sidebar_overlay">
                  <span class="glass">
                    {{ item.titel }}
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
          v-if="sliderEvent"
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
              :src="sliderEvent.billeder[sliderIndex]"
              class="slider_image"
            />
            <button class="slider_arrow right glass" @click="nextSlide">
              <FontAwesomeIcon :icon="faAngleRight" />
            </button>
            <div class="slider_dots">
              <span
                v-for="(_, i) in sliderEvent.billeder"
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
.event {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.event:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.event_image {
  position: relative;
  overflow: hidden;
}

.event_image img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.3s ease;
}

.event:hover .event_image img {
  transform: scale(1.05);
}

.event_tag {
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

.recurring_icon {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

.event_button_wrapper {
  position: absolute;
  bottom: 12px;
  right: 12px;
}

.event_button {
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

.event_info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  background: #eeeeff;

  .event_cardName {
    color: #0b1071;
    font-family: "Barlow Condensed", sans-serif;
    font-size: 32px;
    font-weight: bold;
  }

  .event_dateAndPrice {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 15px;

    .event_cardDate {
      font-family: "Barlow Condensed", sans-serif;
      color: #535353;
      font-size: 16px;
    }

    .event_cardPrice {
      font-family: "Barlow Condensed", sans-serif;
      font-size: 20px;
      color: #535353;
      font-weight: 600;
    }
  }
}

.event_content {
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
  grid-template-columns: repeat(2, 1fr);

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

.event_info_box {
  font-family: "Inter", sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  padding: 15px 0;
  white-space: pre-line;
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
  text-decoration: none;
  display: inline-block;
}

.button_wrapper {
  display: flex;
  justify-content: center;
}

.no_results {
  color: white;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 20px;
  padding: 20px 0;
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

.event_section_group {
  margin-bottom: 40px;
}

.section_heading {
  color: white;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 28px;
  margin-bottom: 16px;
}

@media (min-width: 993px) {
  .filter_toggle {
    display: none;
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

  .event_button_wrapper {
    display: none;
  }

  .event_content {
    max-height: 0 !important;
    overflow: visible !important;
    padding: 0 20px 20px !important;
    display: none;
  }

  .event_dateAndPrice {
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

.sidebar_event {
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

.opened_modal_eventbox {
  display: flex;
  align-items: stretch;

  .event_detail {
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

.modal_event-gallery {
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
