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
    venue: f.venue ?? "",
    pris: f.pris ?? null,
    billetLink: f.billetLink ?? null,
    fastBegivenhed: f.fastBegivenhed ?? false,
  };
});
</script>

<template>
  <div class="hero_image full-bleed">
    <img src="../assets/images/Studenterhuset_begivenheder.jpg" alt="" />
  </div>

  <div class="container container--md mt-4 mb-3">
    <h1>Begivenheder</h1>
    <p>
      Der sker altid noget på Studenterhuset. Fra fredagsbarer og quizaftener
      til kreative workshops og fællesspisning. Kig forbi og bliv en del af
      fællesskabet.
    </p>
  </div>

  <EventMenu :events="begivenheder" />
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