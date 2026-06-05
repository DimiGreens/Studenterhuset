<script setup>
const mySlides = [
  {
    id: 1,
    image: "https://picsum.photos/800/400?random=1",
    title: "Slide title",
  },
  {
    id: 2,
    image: "https://picsum.photos/800/400?random=2",
    title: "Slide title",
  },
  {
    id: 3,
    image: "https://picsum.photos/800/400?random=3",
    title: "Slide title",
  },
  {
    id: 4,
    image: "https://picsum.photos/800/400?random=4",
    title: "Slide title",
  },
];

// Henter hero-billedet til caféen-siden
const { data: heroBillede } = await useFetch("/api/contentful", {
  query: {
    contentType: "heroBillede",
    include: 1,
    "fields.billedtitel": "Cafeen Hero",
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
    "fields.titel": "Glass box cafeen",
  },
});
</script>
<template>
  <div>
    <div
      class="hero full-bleed container container-md"
      :style="heroImgUrl ? { backgroundImage: `url(${heroImgUrl})` } : {}"
    >
      <HeroGlassBox
        :heading="glassBox?.items?.[0]?.fields?.heading"
        :hero-tagline="glassBox?.items?.[0]?.fields?.heroTagline"
      />
    </div>
    <div>
      <Menu :menuItem="menuItem" />
    </div>
    <div class="container container--md container_desktop_split mt-5 mb-5">
      <img src="../assets/images/Studenterhuset_frivillig.jpg" alt="" />
      <div class="split_container">
        <h2 class="section_headline">Bliv frivillig</h2>
        <p>
          Studenterhuset er drevet af bl.a. frivillige, de spiller faktisk en
          stor rolle for os, for uden dem kunne vi ikke levere alle de
          fantastiske oplevelser vi er kendt for. Bliv en del af et fedt
          fællesskab og læs mere om hvad det vil sige at være frivillig på
          Studenterhuset.
        </p>
        <div class="cafe_image mt-2">
          <NuxtLink class="button_primary_color" to="/volunteer">
            Bliv Frivillig <FontAwesomeIcon :icon="faAngleRight" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.opening-hours {
  margin: 0 auto;
  max-width: 300px;
}
</style>
