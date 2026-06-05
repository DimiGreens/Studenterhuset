<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

// Henter hero-billedet til studerende-siden
const { data: heroBillede } = await useFetch("/api/contentful", {
  query: {
    contentType: "heroBillede",
    include: 1,
    "fields.billedtitel": "Til Studerende Hero",
  },
});

// Starter som null, sættes til den faktiske skærmbredde i browseren (undgår hydration-mismatch)
const screenWidth = ref(null);

onMounted(() => {
  screenWidth.value = window.innerWidth;
});

// Beregner den korrekte billed-URL ud fra skærmbredden, sender et mindre billede til mobil
const heroImgUrl = computed(() => {
  const item = heroBillede.value?.items?.[0];
  const assetId = item?.fields?.heroImg?.[0]?.sys?.id;
  const asset = heroBillede.value?.includes?.Asset?.find(
    (a) => a.sys.id === assetId,
  );
  if (!asset) return null;

  const w = screenWidth.value;
  let width;
  if (w === null || w >= 1510) {
    width = 1920;
  } else if (w < 992) {
    width = 600;
  } else {
    width = 992;
  }

  return `https:${asset.fields.file.url}?w=${width}&q=80&fm=webp`;
});

// Henter tekst-indholdet til glasbox-boksen oven på hero-billedet
const { data: glassBox } = await useFetch("/api/contentful", {
  query: {
    contentType: "heroGlassBox",
    include: 1,
    "fields.titel": "Glass box til studerende",
  },
});

// Henter de kommende begivenheder til slider-sektionen nederst på siden
const { data: eventData } = await useFetch("/api/contentful", {
  query: { contentType: "begivenheder", include: 3 },
  fresh: true,
});

// Assets (billeder) til begivenheder ligger i includes, ikke direkte på felterne
const allEventAssets = eventData.value?.includes?.Asset ?? [];

// Slår et billed-link op i includes-listen og returnerer den fulde URL
const resolveEventAsset = (assetLink) => {
  if (!assetLink?.sys?.id) return null;
  const asset = allEventAssets.find((a) => a.sys.id === assetLink.sys.id);
  return asset ? "https:" + asset.fields.file.url : null;
};

// Formaterer et ISO-tidsstempel til dansk datoformat (fx "15/03/2025")
const formatEventDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

// Opretter en "i dag"-dato uden klokkeslæt til sammenligning
const today = new Date();
today.setHours(0, 0, 0, 0);

// Mapper, filtrerer fortidige fra, sorterer og tager de 3 nærmeste begivenheder til slideren
const kommendBegivenheder = (eventData.value?.items ?? [])
  .map((item) => {
    const f = item.fields;
    return {
      id: item.sys.id,
      titel: f.titel ?? "",
      billede: Array.isArray(f.billeder)
        ? resolveEventAsset(f.billeder[0]) // bruger det første billede som preview
        : null,
      dato: formatEventDate(f.dato),
      pris: f.pris ?? null,
      _dateObj: f.dato ? new Date(f.dato) : null,
    };
  })
  .filter((e) => e._dateObj && e._dateObj >= today)
  .sort((a, b) => a._dateObj - b._dateObj)
  .slice(0, 3);

// Navigerer til begivenhedssiden, åbner specifik begivenhed på desktop via URL-parameter
function goToEvent(id) {
  if (window.innerWidth >= 993) {
    navigateTo(`/events?open=${id}`);
  } else {
    navigateTo("/events");
  }
}
</script>

<template>
  <div
    class="hero full-bleed container container-md"
    :style="heroImgUrl ? { backgroundImage: `url(${heroImgUrl})` } : {}"
  >
    <HeroGlassBox
      :heading="glassBox?.items?.[0]?.fields?.heading"
      :hero-tagline="glassBox?.items?.[0]?.fields?.heroTagline"
    />
  </div>

  <div class="container container--sm mt-5">
    <p class="section_sub_headline">Læs op i</p>
    <h2 class="section_headline">Læsesalen</h2>
    <p>
      Læsesalen er åben døgnet rundt, men kun for studerende med gyldigt AAU-
      eller UCN-studiekort. Studerende med gyldigt AAU-studiekort har automatisk
      adgang til læsesalen. Studerende med UCN-studiekort skal derimod have
      adgang aktiveret - kontakt derfor din uddannelses Facility Service for at
      få det oprettet.
    </p>
  </div>

  <div class="container container--sm mt-5">
    <p class="section_sub_headline">Plads til gruppearbejdet</p>
    <h2 class="section_headline">Booking af AAU-Grupperum</h2>
    <p>
      På Studenterhuset er det muligt at booke grupperumslokalerne: 311, 312,
      313, 314, 404 og 406. Dette administreres af Campus Service AAU, og ikke
      Studenterhuset. Det er kun studerende på Aalborg Universitet, der kan
      benytte lokalerne.
    </p>
    <p>Lokalerne bookes gennem følgende <a href="https://book01.webbook.dk/auc/portal_booking2/index.php">link</a></p>
    <p>Benyt gæstelogin</p>
    <ul>
      <li>Bruger: guest</li>
      <li>Kode: guest</li>
    </ul>
    <p>
      Anmodningen skal sendes senest 24 timer før ønsket brug. Dit AAU
      studiekort skal låses op, og derfor skal du anmode om dette i kommentaren
      ved booking.
    </p>
  </div>

  <div class="container container--sm mt-5">
    <p class="section_sub_headline">Mangler du lokale til dit næste event?</p>
    <h2 class="section_headline">Leje af lokaler</h2>
    <p>
      Studenterhuset Aalborg består foruden caféen af en koncertsal og et mindre
      lokale på 1. sal kaldet Stargate.
    </p>
    <p>
      Er du studerende ved AAU eller UCN kan du og dit studie gratis låne
      lokaler til at holde foredrag, koncert eller lignende. Koncertsalen lånes
      også ud til studiefester med minimum 150 deltagere. Vi stiller personale i
      baren, og I får som studerende rabat på drikkevarer. Hvis der skal bruges
      lyd- og lysudstyr, samt hvis vi skal stille med personale til andre
      opgaver, såsom oprydning, vil der være betaling for dette.
    </p>
    <p>
      Vi låner og lejer ikke vores lokaler ud til private fester, bryllupper og
      lignende.
    </p>
    <p>
      Foreninger eller arrangører med et kulturelt sigte kan leje lokaler. Pris
      vil afhænge af typen af arrangement.
    </p>
  </div>

  <div class="container container--md container_desktop_split mt-5 mb-5">
    <img src="../assets/images/Studenterhuset_frivillig.jpg" alt="" />
    <div class="split_container">
      <h2 class="section_headline">Bliv frivillig</h2>
      <p>
        Studenterhuset er drevet af bl.a. frivillige, de spiller faktisk en stor
        rolle for os, for uden dem kunne vi ikke levere alle de fantastiske
        oplevelser vi er kendt for. Bliv en del af et fedt fællesskab og læs
        mere om hvad det vil sige at være frivillig på Studenterhuset.
      </p>
      <div class="cafe_image mt-2">
        <NuxtLink class="button_primary_color" to="/volunteer">
          Bliv Frivillig <FontAwesomeIcon :icon="faAngleRight" />
        </NuxtLink>
      </div>
    </div>
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
</template>

<style scoped>
.hero_image {
  margin: 0 -15px;

  img {
    height: 80vh;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
}

/* ── KORT ──────────────────────────────────────────── */
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

.event_info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  background: #eeeeff;
}

.event_cardName {
  color: #0b1071;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 32px;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.event_dateAndPrice {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 15px;
}

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

/* ── GRID / SWIPER ─────────────────────────────────── */
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
</style>
