<script setup>
// Henter alle begivenheder fra Contentful og mapper data til EventMenu-komponenten

const { data } = await useFetch("/api/contentful", {
  query: { contentType: "begivenheder", include: 3 },
  fresh: true,
});

// Contentful returnerer assets (billeder) separat under "includes", ikke direkte på felterne
const allAssets = data.value?.includes?.Asset ?? [];

// Slår et asset-link op i includes-listen og returnerer den fulde billed-URL
const resolveAsset = (assetLink) => {
  if (!assetLink?.sys?.id) return null;
  const asset = allAssets.find((a) => a.sys.id === assetLink.sys.id);
  return asset ? "https:" + asset.fields.file.url : null;
};

// Formaterer et ISO-tidsstempel til dansk datoformat (fx "15/03/2025")
const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

// Formaterer et ISO-tidsstempel til klokkeslæt (fx "20:00")
const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// Mapper alle begivenheder til en flad datastruktur som EventMenu-komponenten kan bruge direkte
const begivenheder = (data.value?.items ?? []).map((item) => {
  const f = item.fields;

  return {
    id: item.sys.id,
    titel: f.titel ?? "",
    beskrivelse: f.beskrivelse ?? "",
    // billeder er et array af asset-links, resolver dem alle og filtrerer null-værdier fra
    billeder: Array.isArray(f.billeder)
      ? f.billeder.map(resolveAsset).filter(Boolean)
      : [],
    // bruger det første billede som preview-billede (vist på kortet)
    billede: Array.isArray(f.billeder) ? resolveAsset(f.billeder[0]) : null,
    dato: formatDate(f.dato),
    tid: formatTime(f.dato),
    kategori: Array.isArray(f.kategori)
      ? (f.kategori[0] ?? null)
      : (f.kategori ?? null),
    venue: f.venue ?? "",
    pris: f.pris ?? null,
    note: f.note ?? "",
    billetLink: f.billetLink ?? null,
    fastBegivenhed: f.fastBegivenhed ?? false, // angiver om det er en tilbagevendende fast begivenhed (fx fredagsbar)
  };
});


// Henter hero-billedet til begivenhedssiden
const { data: heroBillede } = await useFetch("/api/contentful", {
  query: {
    contentType: "heroBillede",
    include: 1,
    "fields.billedtitel": "Begivenheder Hero",
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

const { data: glassBox } = await useFetch("/api/contentful", {
  query: {
    contentType: "heroGlassBox",
    include: 1,
    "fields.titel": "Glass box begivenheder",
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
    <p class="section_sub_headline">Velkendte øjeblikke</p>
    <h2 class="section_headline">Faste begivenheder</h2>
  </div>

  <EventMenu :events="begivenheder" />

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
.hero_image {
  img {
    height: 80vh;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
}
</style>
