<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const { data: heroBillede } = await useFetch("/api/contentful", {
  query: {
    contentType: "heroBillede",
    include: 1,
    "fields.billedtitel": "Forside Hero desktop",
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

  return `https:${asset.fields.file.url}?w=${width}&q=100&fm=webp`;
});
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

const { data: glassBox } = await useFetch("/api/contentful", {
  query: {
    contentType: "heroGlassBox",
    include: 1,
    "fields.titel": "Glass box forside",
  },
});

const { data: koncertData } = await useFetch("/api/contentful", {
  query: { contentType: "koncerter", include: 3 },
  fresh: true,
});

const allConcertEntries = koncertData.value?.includes?.Entry ?? [];
const allConcertAssets = koncertData.value?.includes?.Asset ?? [];

const resolveConcertAsset = (assetLink) => {
  if (!assetLink?.sys?.id) return null;
  const asset = allConcertAssets.find((a) => a.sys.id === assetLink.sys.id);
  return asset ? "https:" + asset.fields.file.url : null;
};

const resolveArtist = (artistLink) => {
  if (!artistLink?.sys?.id) return null;
  const artist = allConcertEntries.find((e) => e.sys.id === artistLink.sys.id);
  return artist ? { navn: artist.fields.navn } : null;
};

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const today = new Date();
today.setHours(0, 0, 0, 0);

const kommendKoncerter = (koncertData.value?.items ?? [])
  .map((item) => {
    const f = item.fields;
    const hovedact = resolveArtist(f.hovedact);
    const dateStr = formatDate(f.datoOgKoncertStart);
    return {
      id: item.sys.id,
      bandName: hovedact?.navn ?? f.titel,
      bandImage: resolveConcertAsset(f.koncertBillede),
      genre: Array.isArray(f.genre) ? f.genre[0] : f.genre,
      date: dateStr,
      price: f.pris ?? 0,
      _dateObj: f.datoOgKoncertStart ? new Date(f.datoOgKoncertStart) : null,
    };
  })
  .filter((k) => k._dateObj && k._dateObj >= today)
  .sort((a, b) => a._dateObj - b._dateObj)
  .slice(0, 3);

const { data: eventData } = await useFetch("/api/contentful", {
  query: { contentType: "begivenheder", include: 3 },
  fresh: true,
});

const allEventAssets = eventData.value?.includes?.Asset ?? [];

const resolveEventAsset = (assetLink) => {
  if (!assetLink?.sys?.id) return null;
  const asset = allEventAssets.find((a) => a.sys.id === assetLink.sys.id);
  return asset ? "https:" + asset.fields.file.url : null;
};

const formatEventDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const kommendBegivenheder = (eventData.value?.items ?? [])
  .map((item) => {
    const f = item.fields;
    return {
      id: item.sys.id,
      titel: f.titel ?? "",
      billede: Array.isArray(f.billeder)
        ? resolveEventAsset(f.billeder[0])
        : null,
      dato: formatEventDate(f.dato),
      pris: f.pris ?? null,
      _dateObj: f.dato ? new Date(f.dato) : null,
    };
  })
  .filter((e) => e._dateObj && e._dateObj >= today)
  .sort((a, b) => a._dateObj - b._dateObj)
  .slice(0, 3);

function goToEvent(id) {
  if (window.innerWidth >= 993) {
    navigateTo(`/events?open=${id}`);
  } else {
    navigateTo("/events");
  }
}

function goToConcert(id) {
  if (window.innerWidth >= 993) {
    navigateTo(`/concerts?open=${id}`);
  } else {
    navigateTo("/concerts");
  }
}
</script>

<template>
  <div
    class="hero full-bleed"
    :style="heroImgUrl ? { backgroundImage: `url(${heroImgUrl})` } : {}"
  >
    <HeroGlassBox
      :heading="glassBox?.items?.[0]?.fields?.heading"
      :hero-tagline="glassBox?.items?.[0]?.fields?.heroTagline"
    />
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
    <p class="section_tagline">Live på scenen</p>
    <h2>Kommende koncerter</h2>
    <p>
      Studenterhuset afholder mange koncerter, i alle mulige forskellige genrer,
      så mon ikke der en til netop dig eller dig og dine venner. Gå på opdagelse
      i vores kommende koncerter - vi glæder os til at se dig!
    </p>
    <div class="preview_grid">
      <div
        v-for="item in kommendKoncerter"
        :key="item.id"
        class="preview_card"
        @click="goToConcert(item.id)"
      >
        <div class="preview_image">
          <img :src="item.bandImage" alt="" />
          <span v-if="item.genre" class="preview_tag">{{ item.genre }}</span>
        </div>
        <div class="preview_info">
          <p class="preview_name">{{ item.bandName }}</p>
          <div class="preview_meta">
            <p class="preview_date">{{ item.date }}</p>
            <p class="preview_price">
              {{ item.price ? item.price + ",-" : "Gratis" }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <NuxtLink class="cta glass preview_cta" to="/concerts">
      Opdag Koncerter <FontAwesomeIcon :icon="faAngleRight" />
    </NuxtLink>
  </div>

  <div class="container container--md mb-5">
    <p class="section_tagline">Oplev fællesskabet</p>
    <h2>Begivenheder</h2>
    <p>
      På Studenterhuset har vi nogle fede begivenheder som vores faste
      fredagsbar, brætspilsaften og queer night, kom ned med dine venner eller
      kom alene og bliv en del af fællesskabet.
    </p>
    <div class="preview_grid">
      <div
        v-for="item in kommendBegivenheder"
        :key="item.id"
        class="preview_card"
        @click="goToEvent(item.id)"
      >
        <div class="preview_image">
          <img :src="item.billede" alt="" />
        </div>
        <div class="preview_info">
          <p class="preview_name">{{ item.titel }}</p>
          <div class="preview_meta">
            <p class="preview_date">{{ item.dato }}</p>
            <p class="preview_price">
              {{ item.pris ? item.pris + ",-" : "Gratis" }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <NuxtLink class="cta glass preview_cta" to="/events">
      Se Begivenheder <FontAwesomeIcon :icon="faAngleRight" />
    </NuxtLink>
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

<style scoped>
.preview_grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 24px 0;
}

.preview_card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.preview_card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.preview_image {
  position: relative;
  overflow: hidden;
}

.preview_image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.3s ease;
}

.preview_card:hover .preview_image img {
  transform: scale(1.05);
}

.preview_tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(176, 192, 235, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 100px;
  padding: 4px 14px;
  font-size: 14px;
  color: #111;
  font-family: "Barlow Condensed", sans-serif;
}

.preview_info {
  padding: 15px;
  background: #eeeeff;
}

.preview_name {
  color: #0b1071;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 28px;
  font-weight: bold;
}

.preview_meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 10px;
}

.preview_date {
  font-family: "Barlow Condensed", sans-serif;
  color: #535353;
  font-size: 16px;
}

.preview_price {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 20px;
  color: #535353;
  font-weight: 600;
}

.preview_cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 20px;
  padding: 12px 24px;
  border-radius: 100px;
  text-decoration: none;
  margin-top: 8px;
}

@media (max-width: 992px) {
  .preview_grid {
    grid-template-columns: 1fr;
  }
}
</style>
