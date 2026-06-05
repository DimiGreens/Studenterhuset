<script setup>
import RoyalBeerLogo from "~/assets/images/Royal_Beer_Logo.svg?url";
import AalborgKommuneLogo from "~/assets/images/Aalborg_Kommune_Logo.svg?url";
import KunstFondenLogo from "~/assets/images/Kunstfonden_Logo.svg?url";
import AAULogo from "~/assets/images/AAU_Logo.svg?url";
import UcnLogo from "~/assets/images/UCN_Logo.svg?url";

const mySponser = [
  {
    id: 1,
    sponserName: "Royal Beer",
    sponserImage: RoyalBeerLogo,
    sponserLink: "https://royalunibrew.dk/",
  },
  {
    id: 2,
    sponserName: "UCN",
    sponserImage: UcnLogo,
    sponserLink: "https://www.ucn.dk/",
  },
  {
    id: 3,
    sponserName: "Aalborg Kommune",
    sponserImage: AalborgKommuneLogo,
    sponserLink: "https://www.aalborg.dk/",
  },
  {
    id: 4,
    sponserName: "AAU",
    sponserImage: AAULogo,
    sponserLink: "https://www.aau.dk/",
  },
  {
    id: 5,
    sponserName: "Kunstfonden",
    sponserImage: KunstFondenLogo,
    sponserLink: "https://www.kunst.dk/",
  },
];

const { data: heroBillede } = await useFetch("/api/contentful", {
  query: {
    contentType: "heroBillede",
    include: 1,
    "fields.billedtitel": "Om Studenterhuset Hero",
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
    "fields.titel": "Glass box om studenterhuset",
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
  <div class="container container--sm mt-5">
    <h2 class="section_sub_headline">Bag kulisserne</h2>
    <h2 class="section_headline">Om Studenterhuset</h2>
    <p>
      Beliggende lige i hjertet af Aalborg finder du Studenterhuset.
      Studenterhuset er de studerendes, men også hele Aalborgs hus.
    </p>
    <p>
      Studenterhuset er en selvstændig forening drevet af studerende fra AAU og
      UCN sammen med en lille stab af ansatte. I fællesskab skaber vi koncerter,
      debatter, events og aktiviteter til gavn ikke kun for studielivet men for
      hele byen. Alle er velkommen også uden studiekort.
    </p>
    <p>
      Faciliteterne på Studenterhuset omfatter en hyggelig Café, vores store
      koncertsal, en mindre koncertsal på 1. sal (Stargate), mødelokaler og
      læsesal.
    </p>
  </div>
  <div class="container container--sm mt-5">
    <h2 class="section_sub_headline">Nogen spørgsmål?</h2>
    <h2 class="mb-2 section_headline">FAQ</h2>
    <Accordion :accordion="myAccordion" />
  </div>
  <div class="container container--md container_desktop_split mt-5 mb-5">
    <img src="../assets/images/Studenterhuset_frivillig.jpg" alt="" />
    <div class="split_container">
      <h2 class="section_headline">Bliv frivillig</h2>
      <p>
        Studenterhuset er drevet af bl.a. frivillige, de spiller faktisk en stor
        rolle for os, for uden dem kunne vi ikke levere alle de fantastiske
        oplevelser vi er kendt for. Bliv en del af et fedt fællesskab og læs
        mere om hvad det vil sige at være frivillig på Studenterhuset.
      </p>
      <div class="cafe_image mt-2">
        <NuxtLink class="button_primary_color" to="/volunteer">
          Bliv Frivillig <FontAwesomeIcon :icon="faAngleRight" />
        </NuxtLink>
      </div>
    </div>
  </div>
  <div class="grid grid--2 container container--md mt-5">
    <div class="card_primary_background">
      <Contact :Contact="myContact" />
    </div>
    <div class="card_primary_background">
      <Administration :Administration="myAdministration" />
    </div>
  </div>
  <div class="container container--md mt-5 mb-5">
    <h2 class="section_sub_headline">Tak til vores</h2>
    <h2 class="section_headline">Sponsorer</h2>
    <p>
      Vi sætter stor pris på støtten fra vores samarbejdspartnere, som hjælper
      med at gøre Studenterhuset til det, det er. Herunder finder du dem, vi er
      stolte af at kalde vores sponsorer.
    </p>
    <Sponser :mySponser="mySponser" />
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
