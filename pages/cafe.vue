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

const { data: heroBillede } = await useFetch("/api/contentful", {
  query: {
    contentType: "heroBillede",
    include: 1,
    "fields.billedtitel": "Cafeen Hero",
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
    "fields.titel": "Glass box cafeen",
  },
});
</script>
<template>
  <body>
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
    <div class="container container--md card card--active mb-5">
      <h2>Bliv frivillig</h2>
      <p>
        Studenterhuset er drevet af bl.a. frivillige, de spiller faktisk en stor
        rolle for os, for uden dem kunne vi ikke levere alle de fantastiske
        oplevelser vi er kendt for. Bliv en del af et fedt fællesskab og læs
        mere om hvad det vil sige at være frivillig på Studenterhuset.
      </p>
      <div class="cafe_image mt-2">
        <img src="../assets/images/Studenterhuset_frivillig.jpg" alt="" />
        <NuxtLink class="cta glass card__cta" to="/volunteer">
          Bliv Frivillig <FontAwesomeIcon :icon="faAngleRight" />
        </NuxtLink>
      </div>
    </div>
  </body>
</template>
<style scoped>
.opening-hours {
  margin: 0 auto;
  max-width: 300px;
}
</style>
