<script setup>
const myAccordion = [
  {
    id: 1,
    accordionTitle: "Hvad er Studenterhuset?",
    accordionContent:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus.",
  },
  {
    id: 2,
    accordionTitle: "Hvem kan komme?",
    accordionContent:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus.",
  },
  {
    id: 3,
    accordionTitle: "Hvad sker der på Studenterhuset?",
    accordionContent:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus.",
  },
];

const mySponser = [
  {
    id: 1,
    sponserName: "test1",
    sponserImage: "https://picsum.photos/800/400?random=1",
    sponserLink: "https://www.google.com/",
  },
  {
    id: 2,
    sponserName: "test2",
    sponserImage: "https://picsum.photos/800/400?random=2",
    sponserLink: "https://www.google.com/",
  },
  {
    id: 3,
    sponserName: "test3",
    sponserImage: "https://picsum.photos/800/400?random=3",
    sponserLink: "https://www.google.com/",
  },
  {
    id: 4,
    sponserName: "test4",
    sponserImage: "https://picsum.photos/800/400?random=4",
    sponserLink: "https://www.google.com/",
  },
  {
    id: 5,
    sponserName: "test5",
    sponserImage: "https://picsum.photos/800/400?random=5",
    sponserLink: "https://www.google.com/",
  },
];

const myAdministration = [
  {
    name: "Kunstnerisk leder Mads Mulvad",
    mail: "booking@studenterhuset.dk",
  },
  {
    name: "Barchef, Søren Vegeberg",
    mail: "sv@studenterhuset.dk",
  },
  {
    name: "Pr/Marketing, Bastian Duusgaard",
    mail: "bd@studenterhuset.dk",
  },
  {
    name: "Produktion, Daniel Loke Lynge Thøgersen",
    mail: "production@studenterhuset.dk",
  },
  {
    name: "Booking, Mikkel Bøgholm Frederiksen",
    mail: "mikkel@studenterhuset.dk",
  },
  {
    name: "Frivilligkoordinator, Naja Ravn-Jensen",
    mail: "naja@studenterhuset.dk",
  },
  {
    name: "Lyd-tekniker, Frank Reinau",
    mail: "fr@studenterhuset.dk",
  },
];

const myContact = [
  {
    text: "Studenterhuset",
    mail: "",
    phone: "",
  },
  {
    text: "Gammeltorv",
    mail: "",
    phone: "",
  },
  {
    text: "9000 Aalborg",
    mail: "",
    phone: "",
  },
  {
    text: "CVR: (DK)16736341",
    mail: "",
    phone: "",
  },
  {
    text: "Telefon (man-fre: 10-14)",
    mail: "",
    phone: "+45 31 41 04 74",
  },
  {
    text: "Kontoret (PR / administration / drift / billetter / generelle forespørgsler)",
    mail: "kontoret@studenterhuset.dk",
    phone: "",
  },
  {
    text: "Bestyrelsen",
    mail: "bestyrelsen@studenterhuset.dk",
    phone: "",
  },
  {
    text: "Booking",
    mail: "booking@studenterhuset.dk",
    phone: "",
  },
  {
    text: "Lån og udlejning af lokaler",
    mail: "lokale@studenterhuset.dk",
    phone: "",
  },
];
</script>
<template>
  <div class="hero full-bleed">
    <img src="../assets/images/Studenterhuset_bar.jpg" alt="" />
  </div>
  <div class="container container--md mt-5">
    <h2>Om Studenterhuset</h2>
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
  <div class="container container--md mt-5">
    <h2 class="mb-2">FAQ</h2>
    <Accordion :accordion="myAccordion" />
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
  <div class="grid grid--2 container container--md mt-5">
    <div>
      <Contact :Contact="myContact" />
    </div>
    <div>
      <Administration :Administration="myAdministration" />
    </div>
  </div>
  <div class="container container--md mt-5 mb-5">
    <h2>Sponsorer</h2>
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
