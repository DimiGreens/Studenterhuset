<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

library.add(faAngleRight);

// Henter alle koncerter fra Contentful.
// include: 3 sikrer at relaterede entries (fx kunstner) og assets (fx billeder) pakkes med i svaret
const { data } = await useFetch("/api/contentful", {
  query: { contentType: "koncerter", include: 3 },
  fresh: true,
});

// Contentful returnerer relaterede entries og assets separat under "includes", ikke direkte på felterne
const allEntries = data.value?.includes?.Entry ?? [];
const allAssets = data.value?.includes?.Asset ?? [];

// Slår et asset-link op i includes-listen og returnerer den fulde billed-URL
const resolveAsset = (assetLink) => {
  if (!assetLink?.sys?.id) return null;
  const asset = allAssets.find((a) => a.sys.id === assetLink.sys.id);
  return asset ? "https:" + asset.fields.file.url : null;
};

// Slår en kunstner-reference op i includes-listen og returnerer kunstnerens navn
const resolveArtist = (artistLink) => {
  if (!artistLink?.sys?.id) return null;
  const artist = allEntries.find((e) => e.sys.id === artistLink.sys.id);
  if (!artist) return null;
  return {
    navn: artist.fields.navn,
  };
};

// Formaterer et ISO-tidsstempel til klokkeslæt (fx "20:00")
const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// Formaterer et ISO-tidsstempel til dansk datoformat (fx "15/03/2025")
const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

// Mapper alle koncerter til en flad og overskuelig datastruktur som ConcertMenu-komponenten kan bruge direkte
const koncerter = (data.value?.items ?? []).map((item) => {
  const f = item.fields;
  const hovedact = resolveArtist(f.hovedact);

  return {
    id: item.sys.id,
    bandName: hovedact?.navn ?? f.titel, // kunstnerens navn, falder tilbage på koncert-titlen hvis ingen kunstner er tilknyttet
    bandDescription: f.beskrivelse ?? "",
    bandImage: resolveAsset(f.koncertBillede),
    bandImages: [], // ekstra galleri-billeder (ikke implementeret endnu)
    spotifyEmbed: f.spotifyLinkKoncert, // Spotify- eller YouTube-link til embed-afspiller
    genre: Array.isArray(f.genre) ? f.genre[0] : f.genre,
    date: formatDate(f.datoOgKoncertStart),
    concertStart: formatTime(f.datoOgKoncertStart), // klokkeslæt for koncertstart
    doorsOpen: formatTime(f.doereneAabner), // klokkeslæt for døråbning
    venue: f.sal ?? "", // hvilken sal koncerten afholdes i
    price: f.pris ?? 0,
    note: f.note ?? "", // evt. særlig besked, fx "18+"
    ticketLink: f.billetLink ?? "",
    concertName: f.titel ?? "",
  };
});

// Henter hero-billedet til koncertsiden
const { data: heroBillede } = await useFetch("/api/contentful", {
  query: {
    contentType: "heroBillede",
    include: 1,
    "fields.billedtitel": "Koncerter hero",
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
    "fields.titel": "Glass box koncerter",
  },
});
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
<div class="container container--md mt-4 mb-3">
    <p class="section_sub_headline">Se frem til</p>
    <h2 class="section_headline">Kommende koncerter</h2>
  </div>
  <ConcertMenu :concert="koncerter" />

  <div class="container container--sm mt-5 mb-3">
    <p class="section_sub_headline">Er du gammel nok?</p>
    <h2 class="section_headline">Aldersgrænse til koncerter</h2>
    <p>
      Alle er velkommen til Studenterhusets koncerter. Hvis man er under 15, så
      kræver det dog at man er i selskab med en voksen. Efter kl. 24.00 skal man
      være over 18 år for at opholde sig i vores lokaler. Berusede personer
      under 18 år vil blive nægtet adgang på trods af gyldig billet.
    </p>
  </div>

  <div class="container container--sm mt-3 mb-5">
    <p class="section_sub_headline">Husk altid at</p>
    <h2 class="section_headline">Undgå falske billetter</h2>
    <p>
      Vi har desværre set tilfælde af svindel med falske billetter, især til
      vores udsolgte arrangementer. For at undgå dette advarer Studenterhuset
      mod at købe billetter gennem uautoriserede kanaler, da dette indebærer
      risiko for at billetterne er falske/ugyldige. Vi anbefaler, at billetter
      kun købes via vores officielle salgskanaler. Studenterhuset påtager sig
      ikke ansvar for billetter, der er købt andre steder.
    </p>
  </div>

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

<style scoped></style>
