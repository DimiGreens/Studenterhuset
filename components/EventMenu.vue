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
} from "@fortawesome/free-solid-svg-icons";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

// Modtager faerdig-mappet data fra events.vue
const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
});

const allEvents = computed(() => props.events);

const dateInput = ref(null);
const selectedDate = ref(null);
const openId = ref(null);
const contentRefs = ref({});
const selectedEvent = ref(null);
const sliderEvent = ref(null);
const sliderIndex = ref(0);
const windowWidth = ref(
  typeof window !== "undefined" ? window.innerWidth : 1024,
);

// Slider funktioner
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

// Accordion toggle (mobil)
const toggle = (id) => {
  openId.value = openId.value === id ? null : id;
};

// Filtrering: kun fremtidige begivenheder + dato-filter
const filteredEvents = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let result = allEvents.value.filter((item) => {
    if (!item.dato) return false;
    const [day, month, year] = item.dato.split("/");
    const eventDate = new Date(year, month - 1, day);
    return eventDate >= today;
  });

  if (selectedDate.value) {
    result = result.filter((item) => item.dato === selectedDate.value);
  }

  return result;
});

// Resize listener
const onResize = () => (windowWidth.value = window.innerWidth);
onMounted(() => window.addEventListener("resize", onResize));
onUnmounted(() => {
  window.removeEventListener("resize", onResize);
  document.body.style.overflow = "";
});

const isDesktop = computed(() => windowWidth.value > 992);

// Modal funktioner (desktop)
const openModal = (item) => {
  selectedEvent.value = item;
  document.body.style.overflow = "hidden";
};
const closeModal = () => {
  selectedEvent.value = null;
  document.body.style.overflow = "";
};

// Andre begivenheder i sidebar (ekskluder den valgte)
const otherEvents = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return allEvents.value.filter((item) => {
    if (item.id === selectedEvent.value?.id) return false;
    if (!item.dato) return false;

    const [day, month, year] = item.dato.split("/");
    const eventDate = new Date(year, month - 1, day);
    return eventDate >= today;
  });
});

// Dato-picker
const datePicker = ref(null);

onMounted(() => {
  datePicker.value = flatpickr(dateInput.value, {
    dateFormat: "d/m/Y",
    onChange: (selectedDates, dateStr) => {
      selectedDate.value = dateStr;
    },
  });
});

const resetFilters = () => {
  selectedDate.value = null;
  datePicker.value.clear();
};
</script>

<template>
  <div class="event-section container container--lg">
    <div class="filter_wrapper">
      <input ref="dateInput" class="glass" placeholder="Alle datoer" readonly />

      <button
        v-if="selectedDate"
        class="glass reset_button"
        @click="resetFilters"
      >
        Nulstil filter
      </button>
    </div>

    <!-- MOBIL -->
    <div v-if="!isDesktop" class="card_wrapper">
      <div v-for="item in filteredEvents" :key="item.id" class="event">
        <div class="event_name">
          <p>
            {{ item.titel }}
            <FontAwesomeIcon
              v-if="item.fastBegivenhed"
              :icon="faRotate"
              class="recurring_icon"
              title="Fast begivenhed"
            />
          </p>
        </div>
        <div class="event_image">
          <img :src="item.billede" alt="" />

          <div class="event_button_wrapper">
            <button class="event_button glass" @click="toggle(item.id)">
              <FontAwesomeIcon
                :icon="faAngleDown"
                :class="{ rotated: openId === item.id }"
              />
            </button>
          </div>
        </div>

        <div class="event_info">
          <p>{{ item.venue }}</p>
          <p>{{ item.dato }}</p>
          <p v-if="item.pris">{{ item.pris }},-</p>
          <p v-else>Gratis</p>
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
              : {
                  maxHeight: '0px',
                  paddingBottom: '0px',
                }
          "
        >
          <p class="event_info_box">
            {{ item.beskrivelse }}
          </p>
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
              <p>{{ item.pris ? item.pris + ',-' : 'Gratis' }}</p>
            </div>
            <div v-if="item.billetLink" class="button_wrapper">
              <a :href="item.billetLink" target="_blank" class="glass ticket_button">Køb billet</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DESKTOP -->
    <div v-if="isDesktop" class="card_wrapper">
      <div
        v-for="item in filteredEvents"
        :key="item.id"
        class="event"
        @click="openModal(item)"
      >
        <div class="event_name">
          <p>
            {{ item.titel }}
            <FontAwesomeIcon
              v-if="item.fastBegivenhed"
              :icon="faRotate"
              class="recurring_icon"
              title="Fast begivenhed"
            />
          </p>
        </div>
        <div class="event_image">
          <img :src="item.billede" alt="" />
        </div>

        <div class="event_info">
          <p>{{ item.venue }}</p>
          <p>{{ item.dato }}</p>
          <p v-if="item.pris">{{ item.pris }},-</p>
          <p v-else>Gratis</p>
        </div>
      </div>

      <!-- MODAL -->
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
                    v-if="selectedEvent.billeder.length > 1"
                    class="modal_event-gallery glass"
                    @click.stop="openSlider(selectedEvent, 0)"
                  >
                    <FontAwesomeIcon :icon="faExpand" />
                  </button>
                  <img
                    :src="selectedEvent.billede"
                    alt=""
                    class="modal_image"
                  />
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
                    <p class="event_info_box">
                      {{ selectedEvent.beskrivelse }}
                    </p>
                  </div>
                  <div class="event_info">
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
                      <p>{{ selectedEvent.pris ? selectedEvent.pris + ',-' : 'Gratis' }}</p>
                    </div>
                    <div v-if="selectedEvent.billetLink" class="button_wrapper">
                      <a :href="selectedEvent.billetLink" target="_blank" class="glass ticket_button">Køb billet</a>
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
                    <span class="glass"
                      >{{ item.titel }}
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

      <!-- SLIDER -->
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
  </div>
</template>

<style scoped>
.recurring_icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
  margin-left: 6px;
}

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
  align-items: center;
  gap: 15px;
  margin: 30px 0;
}

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
}

.event {
  margin-bottom: 30px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.event_name > p {
  font-size: 24px;
  margin: 15px 0;
  display: flex;
  align-items: center;
}

.event_button_wrapper {
  position: absolute;
  bottom: 10px;
  right: 10px;

  .event_button {
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

  .event_info {
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

.event_image {
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

.event:hover .event_image img {
  transform: scale(1.1);
}

.event_info {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 18px;
  color: white;
  background-color: #5774b8;
  height: 50px;
}

.event_content {
  overflow: hidden;
  transition:
    max-height 0.3s ease,
    padding 0.3s ease;
}

.event_info_box {
  padding: 15px 0;
  white-space: pre-line;
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
  text-decoration: none;
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

@media (max-width: 992px) {
  .filter_wrapper {
    flex-wrap: wrap;
  }

  .filter_wrapper input,
  .filter_wrapper button {
    flex: 1;
    min-width: 140px;
  }
}
</style>