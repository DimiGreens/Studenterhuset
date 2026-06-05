<script setup>
// Bruges til at konvertere Contentful's Rich Text-format til HTML
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

// Henter hero-billedet til frivillig-siden
const { data: heroBillede } = await useFetch("/api/contentful", {
  query: {
    contentType: "heroBillede",
    include: 1,
    "fields.billedtitel": "frivillig hero",
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
    "fields.titel": "Glass box frivillig",
  },
});

// Henter selve brødtekst-indholdet til frivillig-siden fra Contentful (Rich Text-felt)
const { data: frivilligIndhold } = await useFetch("/api/contentful", {
  query: {
    contentType: "frivilligIndhold",
    include: 3,
    "fields.titel": "Frivillig indhold",
  },
});

// Omformer Rich Text-dokumentet til en HTML-streng som kan indsættes direkte i template'en med v-html
const frivilligHtml = computed(() => {
  const doc = frivilligIndhold.value?.items?.[0]?.fields?.indhold;
  return doc ? documentToHtmlString(doc) : "";
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
  <section class="frivilligContainer" v-html="frivilligHtml"></section>
</template>

<style scoped>
.frivilligContainer {
  margin: 15px;
  font-family: "Inter", sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  padding: 15px 0;
  white-space: pre-line;
}

.frivilligContainer :deep(h2) {
  margin-bottom: 0.5rem;
  color: #040048;
  font-size: 36px;

  @media screen and (min-width: 993px) {
    font-size: 64px;
  }
}

.frivilligContainer :deep(h3) {
  margin-bottom: 0.5rem;
  color: var(--primary);
  font-size: 20px;

  @media screen and (min-width: 993px) {
    font-size: 32px;
  }
}

.frivilligContainer :deep(p) {
  margin-bottom: 1rem;
}
.frivilligContainer :deep(ul) {
  margin-inline-start: 15px;
}
@media screen and (min-width: 993px) {
  .frivilligContainer {
    margin-inline: 75px;
  }
}
@media screen and (min-width: 1510px) {
  .frivilligContainer {
    margin-inline: 150px;
    font-size: 20px;
  }
}
</style>
