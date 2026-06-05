<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import FilterLogo from "../assets/images/Filter.svg?component";

import {
  faAngleDown,
  faAngleRight,
  faAngleLeft,
  faExpand,
  faXmark,
  faBars,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

// Modtager listen af koncerter fra concerts.vue (forælderen)
const props = defineProps({
  concert: {
    type: Array,
    default: () => [],
  },
});

// Gør koncert-listen reaktiv via computed, så Vue opdaterer UI automatisk ved prop-ændringer
const concerts = computed(() => props.concert);

// Kontrollerer igen, om indholdet overstiger den tilgængelige plads, når nye data modtages fx fra Contentful. 
watch(
  () => props.concert,
  async () => {
    await nextTick(); // venter til Vue har opdateret DOM'en
    calculateOverflow();
  },
  { deep: true },
);

// Styrer om filter-panelet er åbent (relevant på mobil)
const filterOpen = ref(false);

// Reference til dato-input-feltet så flatpickr-biblioteket kan binde sig til det
const dateInput = ref(null);

// Holder selve flatpickr-instansen, bruges til at kalde .clear() når filtrene nulstilles
const datePicker = ref(null);

// Den dato brugeren har valgt i datofilter (fx "15/03/2025")
const selectedDate = ref(null);

// Holder id'et på det kort der er "slået op" (udvidet) på mobil
const openId = ref(null);

// Gemmer DOM-referencer til de udvidede indholdsafsnit, så vi kan læse deres højde til animationen
const contentRefs = ref({});

// Den valgte genre i filteret, "all" viser alle genrer
const selectedGenre = ref("all");

// Den koncert der er åben i modal-vinduet på desktop
const selectedConcert = ref(null);

// Den koncert der vises i billedgalleri-slideren
const sliderConcert = ref(null);

// Det aktuelle billede-indeks i galleriet
const sliderIndex = ref(0);

// Søgeord fra søgefeltet
const searchQuery = ref("");

// Prisinterval for pris-slideren [min, max]
const priceRange = ref([0, 500]);
const minPrice = ref(0);
const maxPrice = ref(500);

// Beregner placering og bredde af den udfyldte del af pris-slideren som inline CSS-værdier
const rangeFillStyle = computed(() => {
  const span = maxPrice.value - minPrice.value || 1;
  const left = ((priceRange.value[0] - minPrice.value) / span) * 100;
  const right = ((priceRange.value[1] - minPrice.value) / span) * 100;
  return { left: `${left}%`, width: `${right - left}%` };
});

// Samler alle unikke genrer fra koncerterne og sorterer dem alfabetisk til genre-dropdown
const availableGenres = computed(() => {
  const genres = props.concert.map((c) => c.genre).filter(Boolean);
  return [...new Set(genres)].sort();
});

// Forhindrer at min-prisen trækkes forbi max-prisen
function clampMin() {
  if (priceRange.value[0] > priceRange.value[1])
    priceRange.value[0] = priceRange.value[1];
}

// Forhindrer at max-prisen trækkes under min-prisen
function clampMax() {
  if (priceRange.value[1] < priceRange.value[0])
    priceRange.value[1] = priceRange.value[0];
}

// Åbner billedgalleriet, sætter det valgte start-indeks og sætter hovebilledet forrest i arrayet
const openSlider = (item, startIndex = 0) => {
  sliderConcert.value = {
    ...item,
    bandImages: [item.bandImage, ...item.bandImages],
  };
  sliderIndex.value = startIndex;
};
const closeSlider = () => (sliderConcert.value = null);

// Bladrer til forrige billede i galleriet, wrapper rundt fra start til slut
const prevSlide = () =>
  (sliderIndex.value =
    (sliderIndex.value - 1 + sliderConcert.value.bandImages.length) %
    sliderConcert.value.bandImages.length);

// Bladrer til næste billede i galleriet, wrapper rundt fra slut til start
const nextSlide = () =>
  (sliderIndex.value =
    (sliderIndex.value + 1) % sliderConcert.value.bandImages.length);

// Toggler åbning/lukning af mobilkortets udvid-sektion, lukker det hvis det allerede er åbent
const toggle = (id) => {
  openId.value = openId.value === id ? null : id;
};

// Filtrerer koncerterne baseret på alle aktive filtre og viser kun kommende
const filteredConcert = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fjerner koncerter der allerede er overstået
  let result = concerts.value.filter((item) => {
    if (!item.date) return false;
    const [day, month, year] = item.date.split("/");
    const concertDate = new Date(year, month - 1, day);
    return concertDate >= today;
  });

  // Filtrerer på søgeord i band-navn eller genre
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((item) =>
      [item.bandName, item.genre].some((field) =>
        field?.toLowerCase().includes(q),
      ),
    );
  }

  // Filtrerer på den valgte genre
  if (selectedGenre.value !== "all") {
    result = result.filter((item) => item.genre === selectedGenre.value);
  }

  // Filtrerer på den valgte dato
  if (selectedDate.value) {
    result = result.filter((item) => item.date === selectedDate.value);
  }

  // Filtrerer på prisinterval
  result = result.filter(
    (item) =>
      item.price >= priceRange.value[0] && item.price <= priceRange.value[1],
  );

  return result;
});

// Gemmer DOM-referencer til titel-elementerne for hvert kort
const titleRefs = ref({});

// Holder styr på hvilke titler der er for lange til kortet og skal vise marquee-animation (når der ikke er plads til headeren) 
const overflowingTitles = ref({});

// Gemmer antal pixels teksten skal flytte sig ved marquee-animation per kort
const scrollDistances = ref({});

// Sætter DOM-reference og beregner om titlen løber ud over kanten første gang kortet renderes
const setTitleRef = (el, id) => {
  if (!el) return;
  titleRefs.value[id] = el;
  const span = el.querySelector("span");
  if (!span) return;
  const distance = span.scrollWidth - el.clientWidth;
  overflowingTitles.value[id] = distance > 0;
  scrollDistances.value[id] = distance;
};

// Genberegner overflow-status for alle titler, bruges ved resize og prop-opdateringer
const calculateOverflow = () => {
  Object.entries(titleRefs.value).forEach(([id, el]) => {
    const span = el.querySelector("span");
    if (!span) return;
    const distance = span.scrollWidth - el.clientWidth;
    overflowingTitles.value[id] = distance > 0;
    scrollDistances.value[id] = distance;
  });
};

onMounted(async () => {
  await nextTick();
  calculateOverflow();
  window.addEventListener("resize", calculateOverflow);

  if (dateInput.value) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Samler datoerne for alle kommende koncerter i et Set til hurtig opslag i onDayCreate
    const concertDates = new Set(
      props.concert
        .filter((c) => {
          if (!c.date) return false;
          const [day, month, year] = c.date.split("/");
          return new Date(year, month - 1, day) >= today;
        })
        .map((c) => c.date),
    );

    // Initialiserer flatpickr datovelgeren
    datePicker.value = flatpickr(dateInput.value, {
      dateFormat: "d/m/Y",
      disableMobile: true,
      // Opdaterer selectedDate-filteret når brugeren vælger en dato
      onChange: (selectedDates, dateStr) => {
        selectedDate.value = dateStr;
      },
      // Tilføjer CSS-klassen "has-event" på dage med en koncert, så de kan styles med en prik
      onDayCreate: (dObj, dStr, fp, dayElem) => {
        const d = dayElem.dateObj;
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        const formatted = `${day}/${month}/${year}`;

        if (concertDates.has(formatted)) {
          dayElem.classList.add("has-event");
        }
      },
    });

    // Tjekker om URL'en indeholder ?open=id, åbner den pågældende koncert i modal direkte
    const route = useRoute();
    if (route.query.open) {
      const match = concerts.value.find((c) => c.id === route.query.open);
      if (match) openModal(match);
    }
  }

  // Sætter pris-sliderens min/max ud fra de faktiske priser i data
  const prices = props.concert.map((c) => c.price).filter((p) => p != null);
  if (prices.length) {
    minPrice.value = Math.min(...prices);
    maxPrice.value = Math.max(...prices);
    priceRange.value = [minPrice.value, maxPrice.value];
  }
});

// Afgør om embed-URL'en er fra Spotify eller YouTube, bruges til CSS-klasser og iframe-dimensioner
function getEmbedType(url) {
  if (!url) return null;
  if (url.includes("open.spotify.com")) return "spotify";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  return null;
}

// Rydder op: fjerner resize-lytteren og genetablerer scroll på body når komponenten fjernes
onUnmounted(() => {
  window.removeEventListener("resize", calculateOverflow);
  document.body.style.overflow = "";
});

// Åbner modal-vinduet med den valgte koncert og låser baggrunds-scroll
const openModal = (item) => {
  selectedConcert.value = item;
  document.body.style.overflow = "hidden";
};

// Lukker modal-vinduet og genetablerer scroll på body
const closeModal = () => {
  selectedConcert.value = null;
  document.body.style.overflow = "";
};

// Finder andre kommende koncerter inden for samme genre til sidebar'en i modalen
const otherConcerts = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return concerts.value.filter((item) => {
    if (item.id === selectedConcert.value?.id) return false; // springer den åbne koncert over
    if (item.genre !== selectedConcert.value?.genre) return false; // kun samme genre
    if (!item.date) return false;
    const [day, month, year] = item.date.split("/");
    const concertDate = new Date(year, month - 1, day);
    return concertDate >= today;
  });
});

// Nulstiller alle filtre til standardværdier og rydder dato-velgeren
const resetFilters = () => {
  selectedGenre.value = "all";
  selectedDate.value = null;
  datePicker.value?.clear();
  priceRange.value = [minPrice.value, maxPrice.value];
  searchQuery.value = "";
};

// Omformer en Spotify- eller YouTube-URL til den korrekte embed-URL til brug i en iframe
function toEmbedUrl(url) {
  if (!url) return null;

  // Spotify: indsætter "embed/" i URL-stien
  if (url.includes("open.spotify.com")) {
    return url.replace("open.spotify.com/", "open.spotify.com/embed/");
  }

  // YouTube: udtrækker video-id'et og bygger en youtube.com/embed-URL
  // Håndterer både youtube.com/watch?v=ID og youtu.be/ID
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }

  return null;
}

// Åbner modal kun på desktop (>= 993px), på mobil bruges accordion-udvidet kort i stedet
function handleClick(item) {
  if (window.innerWidth >= 993) {
    openModal(item);
  }
}


</script>

<template>
  <div class="container container--md">
    <div class="filter_button_search_wrapper">
      <button class="filter_toggle" @click="filterOpen = !filterOpen">
        <span>Filter</span>
        <FontAwesomeIcon
          class="filter_icon"
          v-if="filterOpen"
          :icon="faXmark"
        />
        <FilterLogo class="filter_icon" v-else />
      </button>

      <input
        v-model="searchQuery"
        type="text"
        placeholder="Søg"
        class="filter_field search_input mobile_search"
      />
    </div>
    <div class="filter_panel" :class="{ open: filterOpen }">
      <div class="filter_panel_header">
        <p>Filter</p>
        <button class="filter_close" @click="filterOpen = false">
          <FontAwesomeIcon :icon="faXmark" />
        </button>
      </div>
      <div class="select_wrapper">
        <select v-model="selectedGenre" class="filter_select">
          <option value="all">Alle genrer</option>
          <option v-for="genre in availableGenres" :key="genre" :value="genre">
            {{ genre }}
          </option>
        </select>
        <FontAwesomeIcon :icon="faChevronDown" class="select_chevron" />
      </div>
      <input
        ref="dateInput"
        class="filter_field filter_select date_select"
        placeholder="Alle datoer"
        readonly
      />

      <div class="price_slider">
        <div class="price_label_wrapper">
          <p class="price_label">{{ priceRange[0] }},-</p>
          <p class="price_label">{{ priceRange[1] }},-</p>
        </div>
        <div class="range_track">
          <div class="range_base"></div>
          <div class="range_fill" :style="rangeFillStyle"></div>
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
        class="filter_field search_input desktop_search"
      />

      <button class="reset_button" @click="resetFilters">Nulstil filtre</button>
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
            <a href=""></a>
            <button class="concert_button glass" @click.stop="toggle(item.id)">
              <FontAwesomeIcon
                :icon="faAngleDown"
                :class="{ rotated: openId === item.id }"
              />
            </button>
          </div>
        </div>

        <div class="concert_info">
          <div
            class="band_cardName"
            :ref="(el) => setTitleRef(el, item.id)"
            :class="{ overflowing: overflowingTitles[item.id] }"
          >
            <span
              :style="{
                '--scroll-distance': `${scrollDistances[item.id] || 0}px`,
              }"
            >
              {{ item.bandName }}
            </span>
          </div>
          <div class="band_dateAndPrice" v-show="openId !== item.id">
            <p class="band_cardDate">{{ item.date }}</p>
            <p class="band_cardPrice">
              {{
                item.price == 0 || item.price == null
                  ? "Gratis"
                  : item.price + ",-"
              }}
            </p>
            <div class="band_noteTag">
              {{ item.note }}
            </div>
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
            <div class="infoText note">
              <p>{{ item.note }}</p>
            </div>
          </div>
          <p class="band_info_box">{{ item.bandDescription }}</p>
          <iframe
            v-if="item.spotifyEmbed"
            :src="toEmbedUrl(item.spotifyEmbed)"
            :class="[
              'media-embed',
              `media-embed--${getEmbedType(item.spotifyEmbed)}`,
            ]"
            width="100%"
            height="180"
            frameborder="0"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen"
          />
          <div class="button_wrapper">
            <a
              :href="item.ticketLink"
              target="_blank"
              class="button_primary_color"
              >Køb billet</a
            >
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
                <button class="modal_close button_primary_color" @click="closeModal">
                  <FontAwesomeIcon :icon="faXmark" />
                </button>
                <button
                  class="modal_band-gallery button_primary_color"
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
                  <h3>{{ selectedConcert.concertName }}</h3>
                  <p
                    class="band_info_box"
                    v-html="selectedConcert.bandDescription"
                  ></p>
                  <iframe
                    v-if="selectedConcert.spotifyEmbed"
                    :src="toEmbedUrl(selectedConcert.spotifyEmbed)"
                    :class="[
                      'media-embed',
                      `media-embed--${getEmbedType(selectedConcert.spotifyEmbed)}`,
                    ]"
                    width="100%"
                    frameborder="0"
                    loading="lazy"
                    allow="
                      autoplay;
                      clipboard-write;
                      encrypted-media;
                      fullscreen;
                    "
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
                    <p>{{ selectedConcert.note }}</p>
                  </div>
                  <div class="button_wrapper">
                    <a
                      :href="selectedConcert.ticketLink"
                      target="_blank"
                      class="button_primary_color"
                      >Køb billet</a
                    >
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
            <button class="modal_close button_primary_color" @click="closeSlider">
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
.desktop_search {
  display: none;
}

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
  position: relative;

  .band_noteTag {
    position: absolute;
    right: 15px;
    bottom: 30px;
    margin-bottom: 15px;
    max-width: 25ch;
    text-align: right;
    font-family: "Barlow Condensed", sans-serif;
    font-size: 16px;
    line-height: normal;
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

.band_cardName {
  color: #0b1071;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 32px;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
}

.band_cardName span {
  display: inline-block;
  white-space: nowrap;
}

.concert:hover .band_cardName.overflowing span {
  animation: marquee 1s linear forwards;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(var(--scroll-distance) * -1));
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

.media-embed {
  width: 100%;
  border: none;
  border-radius: 12px;
}

.media-embed--spotify {
  height: 152px;
}

.media-embed--youtube {
  aspect-ratio: 16 / 9;
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

.note {
  grid-column: 1 / -1;
}

.band_info_box {
  font-family: "Inter", sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  padding: 15px 0;
  white-space: pre-line;
}


.button_wrapper {
  display: flex;
  justify-content: center;
}

/* ---------- FILTER ---------- */

.filter_toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  height: 50px;
  padding: 0 24px;
  font-size: 20px;
  color: white;
  font-family: "Inter", sans-serif;
  cursor: pointer;
  border: none;
  border-radius: 100px;
  background: var(--primary);
  margin: 20px 0;

  svg {
    width: 25px;
    height: 25px;
  }
}
.filter_icon {
  width: 16px;
  height: 16px;
}

.select_wrapper {
  position: relative;
  display: inline-flex;
}
.select_chevron {
  position: absolute;
  top: 50%;
  right: 18px;
  transform: translateY(-50%);
  color: white;
  pointer-events: none;
}

.filter_panel {
  display: none;
  flex-direction: column;
  margin-bottom: 24px;
  border-radius: 16px;
}

.filter_panel.open {
  display: flex;
  background-color: #eeeeff;
  padding: 30px;
  gap: 25px;
}

.filter_panel_header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    font-size: 24px;
    font-family: "Inter", sans-serif;
    color: black;
  }
}

.filter_close {
  width: 44px;
  height: 44px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  border: none;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }
}

.filter_field {
  height: 56px;
  width: 100%;
  font-size: 18px;
  padding: 0 20px;
  border: none;
  outline: none;
  border-radius: 100px;
  font-family: "Inter", sans-serif;
}

.filter_select {
  width: 100%;
  height: 56px;
  font-size: 18px;
  color: white;
  padding: 0 20px;
  cursor: pointer;
  border: none;
  outline: none;
  border-radius: 100px;
  font-family: "Inter", sans-serif;
  background: var(--primary);
}

.search_input {
  background: white;
  color: #111;
}

.filter_button_search_wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  column-gap: 30px;
}

/* Hvid placeholder-tekst på alle filterfelter (inkl. "Alle datoer") */
.filter_select::placeholder {
  color: #fff;
  opacity: 1;
}

/* Genre-select: chevron + delelinje på primary-baggrund */
select.filter_select {
  -webkit-appearance: none;
  appearance: none;
  background-color: var(--primary);
  /* background-repeat: no-repeat, no-repeat; */
  /* background-position: right 44px center, right 18px center; */
  /* background-size: 1px 60%, 16px; */
  padding-right: 56px;
}

.price_label {
  color: black;
  font-size: 18px;
  font-family: "Inter", sans-serif;
  margin-bottom: 8px;
}

.price_label_wrapper {
  display: flex;
  justify-content: space-between;
}

.reset_button {
  height: 56px;
  padding: 0 24px;
  color: white;
  font-size: 18px;
  font-family: "Inter", sans-serif;
  cursor: pointer;
  border: none;
  border-radius: 100px;
  background: var(--primary);
}

.range_track {
  position: relative;
  height: 2rem;
}

/* Grundstreg og udfyldt segment ligger bag de to range-inputs */
.range_base,
.range_fill {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  border-radius: 2px;
  pointer-events: none;
}

.range_base {
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.5);
}

.range_fill {
  background: var(--primary);
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
  background: var(--primary);
  cursor: pointer;
  margin-top: -8px;
  border: 3px solid #5774b8;
}

/* Inputtenes egne spor gøres gennemsigtige, så range_base/range_fill tegner stregen */
.range_track input[type="range"]::-webkit-slider-runnable-track {
  height: 4px;
  background: transparent;
  border-radius: 2px;
}

.range_track input[type="range"]::-moz-range-track {
  height: 4px;
  background: transparent;
  border-radius: 2px;
}

@media (min-width: 993px) {
  .mobile_search {
    display: none;
  }

  .desktop_search {
    display: block;
  }

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
    flex-wrap: nowrap;
    width: 100%;
    padding: none;
    gap: 16px;
    margin-bottom: 30px;
  }

  .open {
    padding: 0;
    background-color: none;
  }

  .filter_panel_header {
    display: none;
  }

  .filter_select {
    height: 50px;
  }

  /* Dato og søg sluger den ledige plads, så rækken fylder hele bredden */
  .date_select,
  .search_input {
    flex: 1;
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
  z-index: 10;
  padding: 0;
  justify-content: center;
  cursor: pointer;
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
  z-index: 10;
  padding: 0;
  justify-content: center;
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
