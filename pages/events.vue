<script setup>
// Henter begivenheder fra Contentful og mapper data til EventMenu

const { data } = await useFetch("/api/contentful", {
  query: { contentType: "begivenheder", include: 3 },
  fresh: true,
});

// Resolved assets ligger i includes, ikke direkte paa felterne
const allAssets = data.value?.includes?.Asset ?? [];

const resolveAsset = (assetLink) => {
  if (!assetLink?.sys?.id) return null;
  const asset = allAssets.find((a) => a.sys.id === assetLink.sys.id);
  return asset ? "https:" + asset.fields.file.url : null;
};

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// Flad datastruktur som EventMenu kan bruge direkte
const begivenheder = (data.value?.items ?? []).map((item) => {
  const f = item.fields;

  return {
    id: item.sys.id,
    titel: f.titel ?? "",
    beskrivelse: f.beskrivelse ?? "",
    // billeder er et array af asset-links — resolve dem alle
    billeder: Array.isArray(f.billeder)
      ? f.billeder.map(resolveAsset).filter(Boolean)
      : [],
    // Brug foerste billede som hovedbillede
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
    fastBegivenhed: f.fastBegivenhed ?? false,
  };
});
console.log(begivenheder);

const { data: heroBillede } = await useFetch("/api/contentful", {
  query: {
    contentType: "heroBillede",
    include: 1,
    "fields.billedtitel": "Begivenheder Hero",
  },
});

const screenWidth = ref(1920);

onMounted(() => {
  screenWidth.value = window.innerWidth;
});

const heroImgUrl = computed(() => {
  const item = heroBillede.value?.items?.[0];
  const assetId = item?.fields?.heroImg?.[0]?.sys?.id;
  const asset = heroBillede.value?.includes?.Asset?.find(
    (a) => a.sys.id === assetId,
  );
  if (!asset) return null;

  let width;
  if (screenWidth.value < 992) {
    width = 600;
  } else if (screenWidth.value < 1510) {
    width = 992;
  } else {
    width = 1920;
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
    <h2 class="section_sub_headline">Velkendte øjeblikke</h2>
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
