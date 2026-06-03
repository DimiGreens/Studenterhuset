<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";


const { data: heroBillede } = await useFetch("/api/contentful", {
  query: { contentType: "heroBillede", include: 1, "fields.billedtitel": "Forside Hero desktop" },
});

const heroImgUrl = computed(() => {
  const item = heroBillede.value?.items?.[0]
  const assetId = item?.fields?.heroImg?.[0]?.sys?.id
  const asset = heroBillede.value?.includes?.Asset?.find(a => a.sys.id === assetId)
  if (!asset) return null
  return `https:${asset.fields.file.url}?w=1920&q=70&fm=webp`
})

const mySlidesConcert = [
  {
    id: 1,
    image: "https://picsum.photos/800/400?random=1",
    title: "Slide title",
    link: "/concerts",
    buttonText: "Opdag Koncerter",
  },
  {
    id: 2,
    image: "https://picsum.photos/800/400?random=2",
    title: "Slide title",
    link: "/concerts",
    buttonText: "Opdag Koncerter",
  },
  {
    id: 3,
    image: "https://picsum.photos/800/400?random=3",
    title: "Slide title",
    link: "/concerts",
    buttonText: "Opdag Koncerter",
  },
  {
    id: 4,
    image: "https://picsum.photos/800/400?random=4",
    title: "Slide title",
    link: "/concerts",
    buttonText: "Opdag Koncerter",
  },
];

const mySlidesEvent = [
  {
    id: 1,
    image: "https://picsum.photos/800/400?random=1",
    title: "Slide title",
    link: "/events",
    buttonText: "Se Begivenheder",
  },
  {
    id: 2,
    image: "https://picsum.photos/800/400?random=2",
    title: "Slide title",
    link: "/events",
    buttonText: "Se Begivenheder",
  },
  {
    id: 3,
    image: "https://picsum.photos/800/400?random=3",
    title: "Slide title",
    link: "/events",
    buttonText: "Se Begivenheder",
  },
  {
    id: 4,
    image: "https://picsum.photos/800/400?random=4",
    title: "Slide title",
    link: "/events",
    buttonText: "Se Begivenheder",
  },
];
</script>

<template>
  <div class="hero full-bleed"
  :style="heroImgUrl ? { backgroundImage: `url(${heroImgUrl})` } : {}">
    
  </div>
  <div class="container container--md mt-4">
    <img src="../assets/images/Studenterhuset_logo_sort.jpg" alt="" />
    <p>
      Velkommen til studenterhuset. I fællesskab skaber vi koncerter, debatter,
      events og aktiviteter til gavn ikke kun for studielivet, men for hele
      byen.
    </p>
    <p>
      Vi omfavner mangfoldighed og byder alle velkommen, uanset politiske
      overbevisninger, seksuelle orienteringer eller trosretninger.
    </p>
  </div>
  <div class="container container--md mb-5">
    <h2>Koncerter</h2>
    <p>
      Studenterhuset afholder mange koncerter, i alle mulige forskellige genrer,
      så mon ikke der en til netop dig eller dig og dine venner. Gå på odagelse
      i vores kommende koncerter - vi glæder os til at se dig!
    </p>
    <ImageSlider :slides="mySlidesConcert" />
  </div>
  <div class="container container--md mb-5">
    <h2>Begivenheder</h2>
    <p>
      På Studenterhuset har vi nogle fede begivenheder som vores faste
      fredagsbar, brætspilsaften og queer night, kom ned med dine venner eller
      kom alene og bliv en del af fællesskabet.
    </p>
    <ImageSlider :slides="mySlidesEvent" />
  </div>
  <div class="container container--md card card--active">
    <h2>Caféen</h2>
    <p>
      Kom ned i vores hyggelige café hvor du bl.a. kan spille bordfodbold, pool
      og brætspil, du kan også bare komme og hænge ud med vennerne med en kop
      kaffe, eller måske du er mere til en eller sodavand - det er ligemeget
      hvad du er til, her er der plads til alle.
    </p>
    <img
      class="cafe_image mt-2"
      src="../assets/images/Studenterhuset_cafe.jpg"
      alt=""
    />
    <NuxtLink class="cta glass card__cta" to="/cafe">
      Gå til caféen <FontAwesomeIcon :icon="faAngleRight" />
    </NuxtLink>
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
