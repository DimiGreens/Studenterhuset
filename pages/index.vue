<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

// Henter hero-billedet til forsiden fra Contentful
const { data: heroBillede } = await useFetch("/api/contentful", {
  query: {
    contentType: "heroBillede",
    include: 1,
    "fields.billedtitel": "Forside Hero desktop",
  },
});

// Starter som null, sættes til den faktiske skærmbredde første gang siden loader i browseren.
// null bruges som udgangspunkt så server og browser ikke producerer forskelligt HTML og skaber en hydration-fejl.
const screenWidth = ref(null);

onMounted(() => {
  screenWidth.value = window.innerWidth;
});

// Beregner den korrekte billed-URL baseret på skærmbredden.
// Vælger en mindre billedstørrelse på mobil for at spare båndbredde.
// Bruger 1920 som fallback hvis skærmbredden endnu ikke er målt (server-side render).
const heroImgUrl = computed(() => {
  const item = heroBillede.value?.items?.[0];
  const assetId = item?.fields?.heroImg?.[0]?.sys?.id;
  const asset = heroBillede.value?.includes?.Asset?.find(
    (a) => a.sys.id === assetId,
  );
  if (!asset) return null;

  const w = screenWidth.value;
  let width;
  if (w === null) {
    width = 1920;
  } else if (w < 992) {
    width = 600;
  } else if (w < 1510) {
    width = 992;
  } else {
    width = 1920;
  }

  return `https:${asset.fields.file.url}?w=${width}&q=100&fm=webp`;
});

// Henter tekst-indholdet til glasbox-boksen der sidder oven på hero-billedet
const { data: glassBox } = await useFetch("/api/contentful", {
  query: {
    contentType: "heroGlassBox",
    include: 1,
    "fields.titel": "Glass box forside",
  },
});

// Henter alle koncerter fra Contentful.
// include: 3 betyder at Contentful også pakker relaterede entries med (fx kunstner-data) 3 niveauer dybt
const { data: koncertData } = await useFetch("/api/contentful", {
  query: { contentType: "koncerter", include: 3 },
  fresh: true,
});

// Contentful returnerer relaterede entries (fx kunstner) og assets (fx billeder) separat under "includes"
const allConcertEntries = koncertData.value?.includes?.Entry ?? [];
const allConcertAssets = koncertData.value?.includes?.Asset ?? [];

// Slår et asset-link op i includes-listen og returnerer den fulde billed-URL
const resolveConcertAsset = (assetLink) => {
  if (!assetLink?.sys?.id) return null;
  const asset = allConcertAssets.find((a) => a.sys.id === assetLink.sys.id);
  return asset ? "https:" + asset.fields.file.url : null;
};

// Slår en kunstner-reference op i includes-listen og returnerer et objekt med artistens navn
const resolveArtist = (artistLink) => {
  if (!artistLink?.sys?.id) return null;
  const artist = allConcertEntries.find((e) => e.sys.id === artistLink.sys.id);
  return artist ? { navn: artist.fields.navn } : null;
};

// Formaterer et ISO-tidsstempel (fx "2025-03-15T20:00") til dansk datoformat (fx "15/03/2025")
const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

// Opretter en "i dag"-dato uden klokkeslæt, så vi kan sammenligne datoer korrekt
const today = new Date();
today.setHours(0, 0, 0, 0);

// Mapper alle koncerter til en flad datastruktur, filtrerer tidligere ud,
// sorterer efter dato og tager de 3 nærmeste til forsiden
const kommendKoncerter = (koncertData.value?.items ?? [])
  .map((item) => {
    const f = item.fields;
    const hovedact = resolveArtist(f.hovedact);
    const dateStr = formatDate(f.datoOgKoncertStart);
    return {
      id: item.sys.id,
      bandName: hovedact?.navn ?? f.titel, // bruger kunstnerens navn, ellers falder den tilbage på koncert-titlen
      bandImage: resolveConcertAsset(f.koncertBillede),
      genre: Array.isArray(f.genre) ? f.genre[0] : f.genre,
      date: dateStr,
      price: f.pris ?? 0,
      _dateObj: f.datoOgKoncertStart ? new Date(f.datoOgKoncertStart) : null, // hjælpe-felt til sortering, vises ikke
    };
  })
  .filter((k) => k._dateObj && k._dateObj >= today) // kun kommende koncerter
  .sort((a, b) => a._dateObj - b._dateObj) // sortér så den næste dato kommer først
  .slice(0, 3); // kun de 3 nærmeste

// Henter alle begivenheder fra Contentful
const { data: eventData } = await useFetch("/api/contentful", {
  query: { contentType: "begivenheder", include: 3 },
  fresh: true,
});

// Assets til begivenheder (billeder) ligger i includes, ikke direkte på item-felterne
const allEventAssets = eventData.value?.includes?.Asset ?? [];

// Slår et billed-link op for begivenheder og returnerer den fulde URL
const resolveEventAsset = (assetLink) => {
  if (!assetLink?.sys?.id) return null;
  const asset = allEventAssets.find((a) => a.sys.id === assetLink.sys.id);
  return asset ? "https:" + asset.fields.file.url : null;
};

// Formaterer dato til dansk format, identisk med formatDate ovenfor
const formatEventDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

// Samme logik som koncerter: mapper, filtrerer fortidige fra, sorterer og tager de 3 nærmeste begivenheder
const kommendBegivenheder = (eventData.value?.items ?? [])
  .map((item) => {
    const f = item.fields;
    return {
      id: item.sys.id,
      titel: f.titel ?? "",
      billede: Array.isArray(f.billeder)
        ? resolveEventAsset(f.billeder[0]) // tager kun det første billede som preview-billede
        : null,
      dato: formatEventDate(f.dato),
      pris: f.pris ?? null,
      _dateObj: f.dato ? new Date(f.dato) : null,
    };
  })
  .filter((e) => e._dateObj && e._dateObj >= today)
  .sort((a, b) => a._dateObj - b._dateObj)
  .slice(0, 3);

// Navigerer til begivenhedssiden.
// På desktop åbner den specifikke begivenhed direkte via URL-parameter (?open=id).
// På mobil sendes brugeren bare til listen, da modal-vinduet ikke bruges på mobil.
function goToEvent(id) {
  if (window.innerWidth >= 993) {
    navigateTo(`/events?open=${id}`);
  } else {
    navigateTo("/events");
  }
}

// Samme logik som goToEvent, men for koncerter
function goToConcert(id) {
  if (window.innerWidth >= 993) {
    navigateTo(`/concerts?open=${id}`);
  } else {
    navigateTo("/concerts");
  }
}
</script>

<template>
  <div
    class="hero full-bleed"
    :style="heroImgUrl ? { backgroundImage: `url(${heroImgUrl})` } : {}"
  >
    <HeroGlassBox
      :heading="glassBox?.items?.[0]?.fields?.heading"
      :hero-tagline="glassBox?.items?.[0]?.fields?.heroTagline"
    />
  </div>

  <!-- KONCERTER -->
  <div class="container container--md mb-5">
    <p class="section_sub_headline">Live på scenen</p>
    <h2 class="section_headline">Kommende koncerter</h2>

    <div class="section_container">
      <p>
        Studenterhuset afholder mange koncerter, i alle mulige forskellige
        genrer, så mon ikke der en til netop dig eller dig og dine venner. Gå på
        opdagelse i vores kommende koncerter - vi glæder os til at se dig!
      </p>
      <NuxtLink class="cta button_primary_color" to="/concerts">
        Opdag Koncerter <FontAwesomeIcon :icon="faAngleRight" />
      </NuxtLink>
    </div>

    <!-- Desktop grid -->
    <div class="desktop_grid">
      <div
        v-for="item in kommendKoncerter"
        :key="item.id"
        class="concert"
        @click="goToConcert(item.id)"
      >
        <div class="concert_image">
          <img :src="item.bandImage" alt="" />
          <span v-if="item.genre" class="concert_genre_tag">{{
            item.genre
          }}</span>
        </div>
        <div class="concert_info">
          <p class="band_cardName">{{ item.bandName }}</p>
          <div class="band_dateAndPrice">
            <p class="band_cardDate">{{ item.date }}</p>
            <p class="band_cardPrice">
              {{ item.price ? item.price + ",-" : "Gratis" }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile swiper -->
    <Swiper
      :modules="[Pagination]"
      :slides-per-view="1"
      :space-between="16"
      :pagination="{ clickable: true }"
      :auto-height="true"
      class="mobile_swiper"
    >
      <SwiperSlide v-for="item in kommendKoncerter" :key="item.id">
        <div class="concert" @click="goToConcert(item.id)">
          <div class="concert_image">
            <img :src="item.bandImage" alt="" />
            <span v-if="item.genre" class="concert_genre_tag">{{
              item.genre
            }}</span>
          </div>
          <div class="concert_info">
            <p class="band_cardName">{{ item.bandName }}</p>
            <div class="band_dateAndPrice">
              <p class="band_cardDate">{{ item.date }}</p>
              <p class="band_cardPrice">
                {{ item.price ? item.price + ",-" : "Gratis" }}
              </p>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>

  <!-- BEGIVENHEDER -->
  <div class="container container--md mb-5">
    <p class="section_sub_headline">Oplev fællesskabet</p>
    <h2 class="section_headline">Begivenheder</h2>

    <div class="section_container">
      <p>
        På Studenterhuset har vi nogle fede begivenheder som vores faste
        fredagsbar, brætspilsaften og queer night, kom ned med dine venner eller
        kom alene og bliv en del af fællesskabet.
      </p>
      <NuxtLink class="cta button_primary_color" to="/events">
        Se Begivenheder <FontAwesomeIcon :icon="faAngleRight" />
      </NuxtLink>
    </div>

    <!-- Desktop grid -->
    <div class="desktop_grid">
      <div
        v-for="item in kommendBegivenheder"
        :key="item.id"
        class="event"
        @click="goToEvent(item.id)"
      >
        <div class="event_image">
          <img :src="item.billede" alt="" />
        </div>
        <div class="event_info">
          <p class="event_cardName">{{ item.titel }}</p>
          <div class="event_dateAndPrice">
            <p class="event_cardDate">{{ item.dato }}</p>
            <p class="event_cardPrice">
              {{ item.pris ? item.pris + ",-" : "Gratis" }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile swiper -->
    <Swiper
      :modules="[Pagination]"
      :slides-per-view="1"
      :space-between="16"
      :pagination="{ clickable: true }"
      :auto-height="true"
      class="mobile_swiper"
    >
      <SwiperSlide v-for="item in kommendBegivenheder" :key="item.id">
        <div class="event" @click="goToEvent(item.id)">
          <div class="event_image">
            <img :src="item.billede" alt="" />
          </div>
          <div class="event_info">
            <p class="event_cardName">{{ item.titel }}</p>
            <div class="event_dateAndPrice">
              <p class="event_cardDate">{{ item.dato }}</p>
              <p class="event_cardPrice">
                {{ item.pris ? item.pris + ",-" : "Gratis" }}
              </p>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>

  <!-- CAFÉ -->
  <div class="container container--md container_desktop_split">
    <img
      class="cafe_image mt-2"
      src="../assets/images/Studenterhuset_cafe.jpg"
      alt=""
    />
    <div class="split_container">
      <h2 class="section_headline">Caféen</h2>
      <p>
        Kom ned i vores hyggelige café hvor du bl.a. kan spille bordfodbold,
        pool og brætspil, du kan også bare komme og hænge ud med vennerne med en
        kop kaffe, eller måske du er mere til en eller sodavand - det er
        ligemeget hvad du er til, her er der plads til alle.
      </p>
      <NuxtLink class="button_primary_color" to="/cafe">
        Gå til caféen <FontAwesomeIcon :icon="faAngleRight" />
      </NuxtLink>
    </div>
  </div>

  <!-- FRIVILLIG + NYHEDSBREV -->
  <div class="grid grid--2 mt-5 mb-5 container container--md">
    <div class="card_primary_background">
      <h2 class="section_headline">Bliv frivillig</h2>
      <p>
        Studenterhuset er drevet af bl.a. frivillige, de spiller faktisk en stor
        rolle for os, for uden dem kunne vi ikke levere alle de fantastiske
        oplevelser vi er kendt for. Bliv en del af et fedt fællesskab og læs
        mere om hvad det vil sige at være frivillig på Studenterhuset.
      </p>
      <div class="volunteer-image-wrap">
        <img src="../assets/images/Studenterhuset_frivillig.jpg" alt="" />
        <NuxtLink class="button_primary_color" to="/volunteer">
          Bliv Frivillig <FontAwesomeIcon :icon="faAngleRight" />
        </NuxtLink>
      </div>
    </div>

    <div class="card_primary_background">
      <h2 class="section_headline">Nyhedsbrev</h2>
      <p>
        Vil du holde dig opdateret på nyheder, koncerter og begivenheder, så
        tilmeld dig vores nyhedsbrev, så går du ikke glip af noget.
      </p>
      <div class="newsletter-fields">
        <label>Navn:</label>
        <div class="newsletter-field">
          <input type="text" placeholder="Dit navn" />
        </div>
        <label>Efternavn:</label>
        <div class="newsletter-field">
          <input type="text" placeholder="Dit efternavn" />
        </div>
        <label>Email:</label>
        <div class="newsletter-field">
          <input type="email" placeholder="Din email" />
        </div>
      </div>
      <button class="button_primary_color">
        Tilmeld Nyhedsbrev <FontAwesomeIcon :icon="faAngleRight" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ── KORT – delt styling ───────────────────────────── */
.concert,
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

.concert:hover,
.event:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

/* ── BILLEDE ───────────────────────────────────────── */
.concert_image,
.event_image {
  position: relative;
  overflow: hidden;
}

.concert_image img,
.event_image img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.3s ease;
}

.concert:hover .concert_image img,
.event:hover .event_image img {
  transform: scale(1.05);
}

/* ── GENRE TAG ─────────────────────────────────────── */
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

/* ── INFO-BOKS ─────────────────────────────────────── */
.concert_info,
.event_info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  background: #eeeeff;
}

/* ── NAVN ──────────────────────────────────────────── */
.band_cardName,
.event_cardName {
  color: #0b1071;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 32px;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* ── DATO + PRIS ───────────────────────────────────── */
.band_dateAndPrice,
.event_dateAndPrice {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 15px;
}

.band_cardDate,
.event_cardDate {
  font-family: "Barlow Condensed", sans-serif;
  color: #535353;
  font-size: 16px;
}

.band_cardPrice,
.event_cardPrice {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 20px;
  color: #535353;
  font-weight: 600;
}

/* ── GRID / SWIPER LAYOUT ──────────────────────────── */
.desktop_grid {
  display: none;
  margin: 24px 0;
}

.mobile_swiper {
  display: block;
  margin: 24px 0 40px;
  padding-bottom: 36px;
}

:deep(.swiper-slide) {
  height: auto;
}

@media (min-width: 993px) {
  .desktop_grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .mobile_swiper {
    display: none;
  }
}

/* ── CAFÉ ──────────────────────────────────────────── */
.cafe_image {
  border-radius: 25px;
}
</style>
