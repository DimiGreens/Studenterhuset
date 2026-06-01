<script setup>
const resolveAsset = (asset) => {
  return asset?.fields?.file?.url ? `https:${asset.fields.file.url}` : null;
};

const { data } = await useFetch("/api/contentful", {
  query: { contentType: "begivenheder", include: 3 },
  fresh: true,
});

const begivenheder = data.value.items.map((item) => ({
  id: item.sys.id,
  titel: item.fields.titel,
  beskrivelse: item.fields.beskrivelse,

  dato: item.fields.datoOgBegivenhedsStart,
  doereneAabner: item.fields.doerneAabner,

  pris: item.fields.pris,
  price: item.fields.pris,

  venue: item.fields.venue,
  billetLink: item.fields.billetLink,

  // Media: many files → array
  billede: item.fields.billeder ? item.fields.billeder.map(resolveAsset) : [],

  billede: item.fields.billeder.url,

  fastBegivenhed: item.fields.fastBegivenhed,
}));

console.log(begivenheder);
</script>

<template>
    <div class="hero_image">
      <img src="../assets/images/Studenterhuset_begivenheder.jpg" alt="">
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
</style>
