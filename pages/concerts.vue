<script setup>
// const myConcert = [
//   {
//     id: 1,
//     bandImage: "https://picsum.photos/800/400?random=1",
//     bandImages: [
//       "https://picsum.photos/800/400?random=10",
//       "https://picsum.photos/800/400?random=11",
//       "https://picsum.photos/800/400?random=12",
//     ],
//     bandName: "Super Pop-band",
//     bandDescription:
//       "Tester 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus. Aenean iaculis purus ut enim feugiat rutrum. Quisque semper eu purus vel pretium. Aenean sit amet dui id enim elementum dignissim. In vitae neque in orci aliquet mollis et at eros. Nullam dictum varius ante tempor porttitor. Aliquam venenatis aliquet neque quis tincidunt. Sed sit amet blandit purus. Tester 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus. Aenean iaculis purus ut enim feugiat rutrum. Quisque semper eu purus vel pretium. Aenean sit amet dui id enim elementum dignissim. In vitae neque in orci aliquet mollis et at eros. Nullam dictum varius ante tempor porttitor. Aliquam venenatis aliquet neque quis tincidunt. Sed sit amet blandit purus.",
//     price: 75,
//     genre: "pop",
//     date: "30/05/2026",
//     spotifyEmbed: "4uLU6hMCjMI75M1A2tKUQC",
//     concertStart: "21:00",
//     doorsOpen: "20:30",
//     venue: "Store sal",
//   },
//   {
//     id: 2,
//     bandImage: "https://picsum.photos/800/400?random=2",
//     bandImages: [
//       "https://picsum.photos/800/400?random=13",
//       "https://picsum.photos/800/400?random=14",
//       "https://picsum.photos/800/400?random=15",
//     ],
//     bandName: "Rock n' roll-band",
//     bandDescription:
//       "Tester 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus. Aenean iaculis purus ut enim feugiat rutrum. Quisque semper eu purus vel pretium. Aenean sit amet dui id enim elementum dignissim. In vitae neque in orci aliquet mollis et at eros. Nullam dictum varius ante tempor porttitor. Aliquam venenatis aliquet neque quis tincidunt. Sed sit amet blandit purus.",
//     price: 75,
//     genre: "rock",
//     date: "02/06/2026",
//     spotifyEmbed: "4uLU6hMCjMI75M1A2tKUQC",
//     concertStart: "21:00",
//     doorsOpen: "20:30",
//     venue: "Store sal",
//   },
//   {
//     id: 3,
//     bandImage: "https://picsum.photos/800/400?random=3",
//     bandImages: [
//       "https://picsum.photos/800/400?random=16",
//       "https://picsum.photos/800/400?random=17",
//       "https://picsum.photos/800/400?random=18",
//     ],
//     bandName: "Heavy-metal-band",
//     bandDescription:
//       "Tester 3: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus. Aenean iaculis purus ut enim feugiat rutrum. Quisque semper eu purus vel pretium. Aenean sit amet dui id enim elementum dignissim. In vitae neque in orci aliquet mollis et at eros. Nullam dictum varius ante tempor porttitor. Aliquam venenatis aliquet neque quis tincidunt. Sed sit amet blandit purus.",
//     price: 75,
//     genre: "metal",
//     date: "03/07/2026",
//     spotifyEmbed: "4uLU6hMCjMI75M1A2tKUQC",
//     concertStart: "21:00",
//     doorsOpen: "20:30",
//     venue: "Store sal",
//   },
//   {
//     id: 4,
//     bandImage: "https://picsum.photos/800/400?random=4",
//     bandImages: [
//       "https://picsum.photos/800/400?random=19",
//       "https://picsum.photos/800/400?random=20",
//       "https://picsum.photos/800/400?random=21",
//     ],
//     bandName: "Super Pop-band",
//     bandDescription:
//       "Tester 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus. Aenean iaculis purus ut enim feugiat rutrum. Quisque semper eu purus vel pretium. Aenean sit amet dui id enim elementum dignissim. In vitae neque in orci aliquet mollis et at eros. Nullam dictum varius ante tempor porttitor. Aliquam venenatis aliquet neque quis tincidunt. Sed sit amet blandit purus.",
//     price: 75,
//     genre: "pop",
//     date: "04/07/2026",
//     spotifyEmbed: "4uLU6hMCjMI75M1A2tKUQC",
//     concertStart: "21:00",
//     doorsOpen: "20:30",
//     venue: "Store sal",
//   },
//   {
//     id: 5,
//     bandImage: "https://picsum.photos/800/400?random=5",
//     bandImages: [
//       "https://picsum.photos/800/400?random=22",
//       "https://picsum.photos/800/400?random=23",
//       "https://picsum.photos/800/400?random=24",
//     ],
//     bandName: "Rock n' roll-band",
//     bandDescription:
//       "Tester 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus. Aenean iaculis purus ut enim feugiat rutrum. Quisque semper eu purus vel pretium. Aenean sit amet dui id enim elementum dignissim. In vitae neque in orci aliquet mollis et at eros. Nullam dictum varius ante tempor porttitor. Aliquam venenatis aliquet neque quis tincidunt. Sed sit amet blandit purus.",
//     price: 75,
//     genre: "rock",
//     date: "12/11/2026",
//     spotifyEmbed: "4uLU6hMCjMI75M1A2tKUQC",
//     concertStart: "21:00",
//     doorsOpen: "20:30",
//     venue: "Store sal",
//   },
//   {
//     id: 6,
//     bandImage: "https://picsum.photos/800/400?random=6",
//     bandImages: [
//       "https://picsum.photos/800/400?random=25",
//       "https://picsum.photos/800/400?random=26",
//       "https://picsum.photos/800/400?random=27",
//     ],
//     bandName: "Heavy-metal-band",
//     bandDescription:
//       "Tester 3: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus. Aenean iaculis purus ut enim feugiat rutrum. Quisque semper eu purus vel pretium. Aenean sit amet dui id enim elementum dignissim. In vitae neque in orci aliquet mollis et at eros. Nullam dictum varius ante tempor porttitor. Aliquam venenatis aliquet neque quis tincidunt. Sed sit amet blandit purus.",
//     price: 75,
//     genre: "metal",
//     date: "12/11/2026",
//     spotifyEmbed: "4uLU6hMCjMI75M1A2tKUQC",
//     concertStart: "21:00",
//     doorsOpen: "20:30",
//     venue: "Store sal",
//   },
//   {
//     id: 7,
//     bandImage: "https://picsum.photos/800/400?random=7",
//     bandImages: [
//       "https://picsum.photos/800/400?random=28",
//       "https://picsum.photos/800/400?random=29",
//       "https://picsum.photos/800/400?random=30",
//     ],
//     bandName: "Rocky",
//     bandDescription:
//       "Tester 3: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus. Aenean iaculis purus ut enim feugiat rutrum. Quisque semper eu purus vel pretium. Aenean sit amet dui id enim elementum dignissim. In vitae neque in orci aliquet mollis et at eros. Nullam dictum varius ante tempor porttitor. Aliquam venenatis aliquet neque quis tincidunt. Sed sit amet blandit purus.",
//     price: 75,
//     genre: "rock",
//     date: "01/01/2026",
//     spotifyEmbed: "4uLU6hMCjMI75M1A2tKUQC",
//     concertStart: "21:00",
//     doorsOpen: "20:30",
//     venue: "Store sal",
//   },
// ];

const { data } = await useFetch("/api/contentful", {
  query: { contentType: "koncerter", include: 3 },
  fresh: true,
});

const allEntries = data.value.includes?.Entry ?? [];
const allAssets = data.value.includes?.Asset ?? [];

const extractSpotifyId = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  return parts[parts.length - 1].split("?")[0];
};

const resolveAsset = (assetLink) => {
  if (!assetLink?.sys?.id) return null;
  const asset = allAssets.find((a) => a.sys.id === assetLink.sys.id);
  return asset ? "https:" + asset.fields.file.url : null;
};

const resolveArtist = (artistLink) => {
  if (!artistLink?.sys?.id) return null;
  const artist = allEntries.find((e) => e.sys.id === artistLink.sys.id);
  if (!artist) return null;
  return {
    navn: artist.fields.navn,
    beskrivelse: artist.fields.beskrivelse,
    genre: artist.fields.genre,
    spotifyLink: artist.fields.spotifyLink,
    billede: resolveAsset(artist.fields?.billede),
  };
};

const formatTime = (isoString) => {
  if (!isoString) return null;
  const date = new Date(isoString);
  return date.toLocaleTimeString("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (isoString) => {
  if (!isoString) return null;
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const koncerter = data.value.items.map((item) => ({
  id: item.sys.id,
  titel: item.fields.titel,
  bandName: item.fields.titel,
  beskrivelse: item.fields.beskrivelse,
  bandDescription: item.fields.beskrivelse,
  dato: item.fields.datoOgKoncertStart,
  date: formatDate(item.fields.datoOgKoncertStart),
  concertStart: formatTime(item.fields.datoOgKoncertStart),
  doereneAabner: item.fields.doereneAabner,
  doorsOpen: formatTime(item.fields.doereneAabner),
  genre: Array.isArray(item.fields.genre)
    ? item.fields.genre[0]
    : item.fields.genre,
  pris: item.fields.pris,
  price: item.fields.pris,
  sal: item.fields.sal,
  venue: item.fields.sal,
  billetLink: item.fields.billetLink,
  spotifyEmbed: extractSpotifyId(item.fields.spotifyLinkKoncert),
  billede: resolveAsset(item.fields.koncertBillede),
  bandImage: resolveAsset(item.fields.koncertBillede),
  bandImages: [],
  hovedact: resolveArtist(item.fields.hovedact),
  support: resolveArtist(item.fields.support),
}));

console.log(data.value.items[0].fields.spotifyLinkKoncert);
</script>
<template>
  <div class="hero full-bleed">
    <img src="../assets/images/Studenterhuset_koncert.JPG" alt="" />
  </div>

  <div class="container container--md mt-4 mb-3">
    <h1>Koncerter</h1>
    <p>
      Her i Studenterhuset har vi mange forskellige genrer og vi fungerer som
      vækstlag for upcoming artister, men vi ligger også hus til mere seasoned
      kunstnere. Der er noget for en hver smag og vi har en bred vifte af genre
      med artister fra hele verdenen.
    </p>
  </div>

  <ConcertMenu :concert="koncerter" />

  <div class="container container--md mt-5 mb-3">
    <h2>Aldersgrænse til koncerter</h2>
    <p>
      Alle er velkommen til Studenterhusets koncerter. Hvis man er under 15, så
      kræver det dog at man er i selskab med en voksen. Efter kl. 24.00 skal man
      være over 18 år for at opholde sig i vores lokaler. Berusede personer
      under 18 år vil blive nægtet adgang på trods af gyldig billet.
    </p>
  </div>

  <div class="container container--md mt-3 mb-5">
    <h2>Undgå falske billetter</h2>
    <p>
      Vi har desværre set tilfælde af svindel med falske billetter, især til
      vores udsolgte arrangementer. For at undgå dette advarer Studenterhuset
      mod at købe billetter gennem uautoriserede kanaler, da dette indebærer
      risiko for at billetterne er falske/ugyldige. Vi anbefaler, at billetter
      kun købes via vores officielle salgskanaler. Studenterhuset påtager sig
      ikke ansvar for billetter, der er købt andre steder.
    </p>
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
