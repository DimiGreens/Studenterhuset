<script setup>
const mySlides = [
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
  <div class="hero full-bleed">
    <img src="../assets/images/Studenterhuset_bar.jpg" alt="" />
  </div>
  <div class="container container--md">
    <h2>Til Studerende</h2>
    <p>
      Studenterhuset tilbyder nogle tilbud til studerende, det indebærer en
      læsesal, grupperum og leje af lokaler.
    </p>
  </div>
  <div class="container container--md mt-5">
    <h2>Læsesalen</h2>
    <p>
      Læsesalen er åben døgnet rundt, men kun for studerende med gyldigt AAU-
      eller UCN-studiekort. Studerende med gyldigt AAU-studiekort har automatisk
      adgang til læsesalen. Studerende med UCN-studiekort skal derimod have
      adgang aktiveret - kontakt derfor din uddannelses Facility Service for at
      få det oprettet.
    </p>
  </div>
  <div class="container container--md mt-5">
    <h2>Booking af AAU-Grupperum</h2>
    <p>
      På Studenterhuset er det muligt at booke grupperumslokalerne: 311, 312,
      313, 314, 404 og 406. Dette administreres af Campus Service AAU, og ikke
      Studenterhuset. Det er kun studerende på Aalborg Universitet, der kan
      benytte lokalerne.
    </p>
    <p>
      Lokalerne bookes gennem følgende link:
      <a
        target="_blank"
        href="https://book01.webbook.dk/auc/portal_booking2/index.php"
        >https://book01.webbook.dk/auc/portal_booking2/index.php</a
      >
    </p>
    <p>Benyt gæstelogin</p>
    <ul>
      <li>Bruger: guest</li>
      <li>Kode: guest</li>
    </ul>
    <p>
      Anmodningen skal sendes senest 24 timer før ønsket brug. Dit AAU
      studiekort skal låses op, og derfor skal du anmode om dette i kommentaren
      ved booking.
    </p>
  </div>
  <div class="container container--md mt-5">
    <h2>Leje af lokaler</h2>
    <p>
      Studenterhuset Aalborg består foruden caféen af en koncertsal og et mindre
      lokale på 1. sal kaldet Stargate.
    </p>
    <p>
      Er du studerende ved AAU eller UCN kan du og dit studie gratis låne
      lokaler til at holde foredrag, koncert eller lignende. Koncertsalen lånes
      også ud til studiefester med minimum 150 deltagere. Vi stiller personale i
      baren, og I får som studerende rabat på drikkevarer. Hvis der skal bruges
      lyd- og lysudstyr, samt hvis vi skal stille med personale til andre
      opgaver, såsom oprydning, vil der være betaling for dette.
    </p>
    <p>
      Vi låner og lejer ikke vores lokaler ud til private fester, bryllupper og
      lignende.
    </p>
    <p>
      Foreninger eller arrangører med et kulturelt sigte kan leje lokaler. Pris
      vil afhænge af typen af arrangement.
    </p>
  </div>
  <div class="container container--md card card--active mt-5">
    <h2>Bliv frivillig</h2>
    <p>
      Studenterhuset er drevet af bl.a. frivillige, de spiller faktisk en stor
      rolle for os, for uden dem kunne vi ikke levere alle de fantastiske
      oplevelser vi er kendt for. Bliv en del af et fedt fællesskab og læs mere
      om hvad det vil sige at være frivillig på Studenterhuset.
    </p>
    <div class="cafe_image mt-2">
      <img src="../assets/images/Studenterhuset_frivillig.jpg" alt="" />
      <NuxtLink class="cta glass card__cta" to="/frivillig">
        Bliv Frivillig <FontAwesomeIcon :icon="faAngleRight" />
      </NuxtLink>
    </div>
  </div>
  <div class="container container--md mb-5 mt-5">
    <h2>Begivenheder</h2>
    <p>
      På Studenterhuset har vi nogle fede begivenheder som vores faste
      fredagsbar, brætspilsaften og queer night, kom ned med dine venner eller
      kom alene og bliv en del af fællesskabet.
    </p>
    <ImageSlider :slides="mySlides" />
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
