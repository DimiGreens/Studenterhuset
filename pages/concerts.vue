<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

library.add(faAngleRight);

const { data } = await useFetch("/api/contentful", {
  query: { contentType: "koncerter", include: 3 },
  fresh: true,
});

// Resolved entries og assets ligger i includes (ikke direkte paa felterne)
const allEntries = data.value?.includes?.Entry ?? [];
const allAssets = data.value?.includes?.Asset ?? [];


const resolveAsset = (assetLink) => {
  if (!assetLink?.sys?.id) return null;
  const asset = allAssets.find((a) => a.sys.id === assetLink.sys.id);
  return asset ? "https:" + asset.fields.file.url : null;
};

const resolveArtist = (artistLink) => {
  if (!artistLink?.sys?.id) return null;
  const artist = allEntries.find((e) => e.sys.id === artistLink.sys.id);
  if (!artist) return null;
  return {
    navn: artist.fields.navn,
  };
};

const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

// Flad datastruktur som ConcertMenu kan bruge direkte
const koncerter = (data.value?.items ?? []).map((item) => {
  const f = item.fields;
  const hovedact = resolveArtist(f.hovedact);

  return {
    id: item.sys.id,
    bandName: hovedact?.navn ?? f.titel, // artistens navn (fallback: koncert-titel)
    bandDescription: f.beskrivelse ?? "", // koncert-beskrivelse
    bandImage: resolveAsset(f.koncertBillede), // koncert-billede
    bandImages: [],
    spotifyEmbed: f.spotifyLinkKoncert,
    genre: Array.isArray(f.genre) ? f.genre[0] : f.genre,
    date: formatDate(f.datoOgKoncertStart),
    concertStart: formatTime(f.datoOgKoncertStart),
    doorsOpen: formatTime(f.doereneAabner),
    venue: f.sal ?? "",
    price: f.pris ?? 0,
    note: f.note ?? "",
    ticketLink: f.billetLink ?? "",
    concertName: f.titel ?? "",
  };
});
console.log(koncerter)

// henter hero 
const { data: heroBillede } = await useFetch("/api/contentful", {
  query: { contentType: "heroBillede", include: 1, "fields.billedtitel": "Koncerter hero" },
});

const screenWidth = ref(1920)

onMounted(() => {
  screenWidth.value = window.innerWidth
})

const heroImgUrl = computed(() => {
  const item = heroBillede.value?.items?.[0]
  const assetId = item?.fields?.heroImg?.[0]?.sys?.id
  const asset = heroBillede.value?.includes?.Asset?.find(a => a.sys.id === assetId)
  if (!asset) return null

  let width
  if (screenWidth.value < 992) {
    width = 600
  } else if (screenWidth.value < 1510) {
    width = 992
  } else {
    width = 1920
  }

  return `https:${asset.fields.file.url}?w=${width}&q=80&fm=webp`
})
const { data: glassBox } = await useFetch("/api/contentful", {
  query: { contentType: "heroGlassBox", include: 1, "fields.titel": "Glass box koncerter" },
});
</script>

<template>
  <div class="hero full-bleed container container-md"
  :style="heroImgUrl ? { backgroundImage: `url(${heroImgUrl})` } : {}">
    <HeroGlassBox 
    :heading="glassBox?.items?.[0]?.fields?.heading"
    :hero-tagline="glassBox?.items?.[0]?.fields?.heroTagline"
  />
  </div>

  <div class="container container--md mt-4 mb-3">
    <h1>Koncerter</h1>
    <p>
      Her i Studenterhuset har vi mange forskellige genrer og vi fungerer som
      vækstlag for upcoming artister, men vi ligger også hus til mere seasoned
      kunstnere. Der er noget for en hver smag og vi har en bred vifte af genre
      med artister fra hele verdenen.
    </p>
  </div>

  <ConcertMenu :concert="koncerter" />

  <div class="container container--md mt-5 mb-3">
    <h2>Aldersgrænse til koncerter</h2>
    <p>
      Alle er velkommen til Studenterhusets koncerter. Hvis man er under 15, så
      kræver det dog at man er i selskab med en voksen. Efter kl. 24.00 skal man
      være over 18 år for at opholde sig i vores lokaler. Berusede personer
      under 18 år vil blive nægtet adgang på trods af gyldig billet.
    </p>
  </div>

  <div class="container container--md mt-3 mb-5">
    <h2>Undgå falske billetter</h2>
    <p>
      Vi har desværre set tilfælde af svindel med falske billetter, især til
      vores udsolgte arrangementer. For at undgå dette advarer Studenterhuset
      mod at købe billetter gennem uautoriserede kanaler, da dette indebærer
      risiko for at billetterne er falske/ugyldige. Vi anbefaler, at billetter
      kun købes via vores officielle salgskanaler. Studenterhuset påtager sig
      ikke ansvar for billetter, der er købt andre steder.
    </p>
  </div>

  <div class="grid grid--2 mt-5 mb-5 container container--lg">
    <div class="card card--active">
      <h2>Bliv frivillig</h2>
      <p>
        Studenterhuset er drevet af bl.a. frivillige, de spiller faktisk en stor
        rolle for os, for uden dem kunne vi ikke levere alle de fantastiske
        oplevelser vi er kendt for. Bliv en del af et fedt fællesskab og læs
        mere om hvad det vil sige at være frivillig på Studenterhuset.
      </p>
      <div class="volunteer-image-wrap">
        <img src="../assets/images/Studenterhuset_frivillig.jpg" alt="" />
        <NuxtLink class="glass cta card__cta" to="/frivillig">
          Bliv Frivillig <FontAwesomeIcon :icon="faAngleRight" />
        </NuxtLink>
      </div>
    </div>

    <div class="newsletter-section">
      <h2>Nyhedsbrev</h2>
      <p>
        Vil du holde dig opdateret på nyheder, koncerter og begivenheder, så
        tilmeld dig vores nyhedsbrev, så går du ikke glip af noget.
      </p>
      <div class="newsletter-fields">
        <div class="newsletter-field">
          <label>Navn:</label>
          <input type="text" placeholder="Dit navn" />
        </div>
        <div class="newsletter-field">
          <label>Efternavn:</label>
          <input type="text" placeholder="Dit efternavn" />
        </div>
        <div class="newsletter-field">
          <label>Email:</label>
          <input type="email" placeholder="Din email" />
        </div>
      </div>
      <button class="glass cta newsletter-btn">
        Tilmeld Nyhedsbrev <FontAwesomeIcon :icon="faAngleRight" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>