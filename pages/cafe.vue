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

const menuItem = [
  {
    id: 1,
    day: "Hverdage",
    drinks: [
      {
        name: "Kaffe/Te",
        studiepris: 15,
        normalpris: 25,
      },
      {
        name: "To-go Kaffe/Te",
        studiepris: 20,
        normalpris: 20,
      },
      {
        name: "Royal Pilsner",
        studiepris: 35,
        normalpris: 40,
      },
      {
        name: "Royal Classic",
        studiepris: 40,
        normalpris: 45,
      },
      {
        name: "Sodavand",
        studiepris: 20,
        normalpris: 25,
      },
    ],
  },
  {
    id: 2,
    day: "Onsdagspriser",
    drinks: [
      {
        name: "Royal Pilsner",
        studiepris: 25,
        normalpris: 40,
      },
      {
        name: "Royal Classic",
        studiepris: 30,
        normalpris: 45,
      },
      {
        name: "Sodavand",
        studiepris: 20,
        normalpris: 25,
      },
    ],
  },
  {
    id: 3,
    day: "Fredagsbar",
    drinks: [
      {
        name: "Royal Pilsner",
        studiepris: 20,
        normalpris: 40,
      },
      {
        name: "Gin & Tonic",
        studiepris: 25,
        normalpris: 45,
      },
      {
        name: "Sodavand",
        studiepris: 15,
        normalpris: 25,
      },
      {
        name: "Drinks",
        drinkNames: ["Gin & tonic", "Rum & Coke", "Vodka & Juice"],
        alcoholLabel: "Med alkohol",
        studiepris: 40,
        normalpris: 45,
      },
      {
        name: "Drinks",
        drinkNames: ["Gin & tonic", "Rum & Coke", "Vodka & Juice"],
        alcoholLabel: "Uden alkohol",
        studiepris: 40,
        normalpris: 45,
      },
    ],
  },
];

const openingHours = [
  {
    day: "Mandag",
    opening: "13:00",
    closing: "22:00",
  },
  {
    day: "Tirsdag",
    opening: "13:00",
    closing: "22:00",
  },
  {
    day: "Onsdag",
    opening: "13:00",
    closing: "24:00",
  },
  {
    day: "Torsdag",
    opening: "13:00",
    closing: "24:00",
  },
  {
    day: "Fredag",
    opening: "13:00",
    closing: "02:00",
  },
  {
    day: "Lørdag",
    opening: "15:00",
    closing: "02:00",
  },
  {
    day: "Søndag",
    opening: "Lukket",
    closing: "",
  },
];

const { data: heroBillede } = await useFetch("/api/contentful", {
  query: { contentType: "heroBillede", include: 1, "fields.billedtitel": "Cafeen Hero" },
});

const heroImgUrl = computed(() => {
  const item = heroBillede.value?.items?.[0]
  const assetId = item?.fields?.heroImg?.[0]?.sys?.id
  const asset = heroBillede.value?.includes?.Asset?.find(a => a.sys.id === assetId)
  if (!asset) return null
  return `https:${asset.fields.file.url}?w=1920&q=70&fm=webp`
})
</script>
<template>
  <body>
    <div class="hero full-bleed"
       :style="heroImgUrl ? { backgroundImage: `url(${heroImgUrl})` } : {}">
    </div>
    <div class="container container--md">
      <h1>Caféen</h1>
      <p>
        Tag et smut forbi caféen hos Studenterhuset og nyd et bredt udvalg af
        drikkevarer, både med og uden alkohol, til gode studievenlige priser.
        Udover de prisvenlige drinks byder caféen også på masser af hyggelige
        aktiviteter som brætspil, pool, bordfodbold og meget mere, som alle
        gæster frit kan benytte. Så hvis du leder efter et sted med god
        stemning, afslappet atmosfære og plads til hygge med vennerne, er caféen
        i Studenterhuset det perfekte sted at kigge forbi!
      </p>
    </div>
    <div>
      <ImageSlider :slides="mySlides" />
    </div>
    <div class="container container--md mt-5 mb-5">
      <Menu :menuItem="menuItem" />
      <div class="container container-md">
        <OpeningHours :openingHours="openingHours" />
      </div>
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
        <NuxtLink class="cta glass card__cta" to="/frivillig">
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
