<script setup>
const { data } = await useFetch("/api/contentful", {
  query: { contentType: "menu", include: 3 },
  fresh: true,
});

const allEntries = data.value.includes?.Entry ?? [];

const menu = data.value.items[0].fields.menuSektioner
  .map((sektionLink) => {
    const sektion = allEntries.find((e) => e.sys.id === sektionLink.sys.id);
    if (!sektion) return null;

    const resolvedItems = sektion.fields.menuGenstande
      .map((itemLink) => allEntries.find((e) => e.sys.id === itemLink.sys.id))
      .filter(Boolean);

    return {
      titel: sektion.fields.titel,
      items: resolvedItems.map((item) => ({
        navn: item.fields.navn,
        studiePris: item.fields.studiePris,
        normalPris: item.fields.normalPris,
        beskrivelse: item.fields.beskrivelse,
        kategori: item.fields.kategori,
      })),
    };
  })
  .filter(Boolean);
</script>

<template>
  <div class="menucard-wrapper">
    <h2>Menukort</h2>
    <div class="menu_grid">
      <OpeningHours
        :openingHours="openingHours"
        class="glassbox menu-openingHours"
      />
      <div
        v-for="sektion in menu"
        :key="sektion.titel"
        class="menucard-box glassbox"
      >
        <table class="menucard">
          <thead>
            <tr>
              <th>{{ sektion.titel }}</th>
              <th>Studiepriser</th>
              <th>Normal pris</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sektion.items" :key="item.navn">
              <td>
                <span v-if="item.kategori" class="beskrivelse">{{
                  item.kategori
                }}</span>
                {{ item.navn }}
                <span v-if="item.beskrivelse" class="beskrivelse">{{
                  item.beskrivelse
                }}</span>
              </td>
              <td>{{ item.studiePris }},-</td>
              <td>{{ item.normalPris }},-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu_grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  align-items: start;
  background-image: url("../assets/images/Baren.png");
  background-size: cover;
  background-position: center;
  padding: 50px 150px;

  * {
    color: white;
  }
}

.menu-openingHours {
  width: 500px;
}

.beskrivelse {
  display: block;
  font-size: 0.8rem;
}

.menucard {
  width: 100%;
  border-collapse: collapse;
}

.menucard-wrapper {
  width: 100%;

  h2 {
    margin-bottom: 15px;
    padding-left: 150px;
  }
}

.menucard th {
  text-align: left;
  font-size: 1.3rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
}

.menucard th:nth-child(2),
.menucard th:nth-child(3) {
  font-size: 1.1rem;
  font-weight: 400;
  vertical-align: middle;
}

.menucard td {
  padding: 0.4rem 0;
  vertical-align: top;
  font-size: 1.1rem;
}

.menucard td:nth-child(2),
.menucard td:nth-child(3) {
  width: 110px;
  text-align: left;
}

.menucard tr {
  border-spacing: 0;
}

.alcohol-label td {
  font-size: 0.85rem;
  font-weight: 500;
  padding-top: 0.2rem;
  padding-bottom: 0.1rem;
  color: #444;
}

.menucard tr + tr td {
  padding-top: 0.2rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0.1rem 0 0 0;
  display: flex;
}

ul li {
  font-size: 0.8rem;
  line-height: 1.1;
  color: #444;
}

/* @media screen and (min-width: 600px) {
  .menucard {
    margin: 0;
    width: 100%;
  }

  .menucard-wrapper {
    width: 600px;
    margin: 0 auto;
    padding: 0;
  }

  .menucard td {
    padding: 0.7rem 0;
  }

  .menucard th {
    padding-bottom: 1rem;
  }
} */

@media screen and (max-width: 599px) {
  .menu_grid {
    display: block;
    padding: 20px;
  }

  .menucard-box,
  .menu-openingHours {
    width: 100%;
    margin-bottom: 1rem;
  }

  .glassbox {
    width: 100%;
  }

  .menucard {
    display: block;
  }

  .menucard thead tr {
    display: flex;
    margin-bottom: 1rem;
  }

  /* Gem de to priskolonne-headers, vi laver egne labels via ::before */
  .menucard thead th:nth-child(2),
  .menucard thead th:nth-child(3) {
    display: none;
  }

  .menucard tbody {
    display: block;
  }

  .menucard tbody tr {
    display: flex;
    flex-wrap: wrap;
    padding: 0.6rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }

  /* Navn-kolonnen fylder hele bredden */
  .menucard td:nth-child(1) {
    width: 100%;
    padding-bottom: 0.3rem;
  }

  /* Priskolonnerne side om side */
  .menucard td:nth-child(2),
  .menucard td:nth-child(3) {
    width: auto;
    font-size: 0.95rem;
    font-weight: 600;
    padding: 0;
    margin-right: 1.5rem;
  }

  /* Labels foran priserne */
  .menucard td:nth-child(2)::before {
    content: "Studie ";
    font-weight: 400;
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .menucard td:nth-child(3)::before {
    content: "Normal ";
    font-weight: 400;
    font-size: 0.8rem;
    opacity: 0.7;
  }
}

@media screen and (max-width: 768px) {
  .menu_grid {
    display: block;
    padding: 20px;
  }

  .menucard-box,
  .menu-openingHours {
    width: 100%;
    margin-bottom: 1rem;
  }

  .menucard {
    display: block;
  }

  .menucard thead tr {
    display: flex;
    margin-bottom: 1rem;
  }

  /* Gem de to priskolonne-headers, vi laver egne labels via ::before */
  .menucard thead th:nth-child(2),
  .menucard thead th:nth-child(3) {
    display: none;
  }

  .menucard tbody {
    display: block;
  }

  .menucard tbody tr {
    display: flex;
    flex-wrap: wrap;
    padding: 0.6rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }

  /* Navn-kolonnen fylder hele bredden */
  .menucard td:nth-child(1) {
    width: 100%;
    padding-bottom: 0.3rem;
  }

  /* Priskolonnerne side om side */
  .menucard td:nth-child(2),
  .menucard td:nth-child(3) {
    width: auto;
    font-size: 0.95rem;
    font-weight: 600;
    padding: 0;
    margin-right: 1.5rem;
  }

  /* Labels foran priserne */
  .menucard td:nth-child(2)::before {
    content: "Studie ";
    font-weight: 400;
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .menucard td:nth-child(3)::before {
    content: "Normal ";
    font-weight: 400;
    font-size: 0.8rem;
    opacity: 0.7;
  }
}

@media screen and (max-width: 1100px) {
  .menu_grid {
    grid-template-columns: 1fr;
    padding: 30px 60px;
  }
}

.glassbox {
  padding: 50px;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 50px;
  border: 0.25px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 1px 0 0 rgba(255, 255, 255, 0.2);
}

.glassbox :deep(h1) {
  font-size: 2rem;
  font-weight: 300;
  color: white;
  line-height: normal;
  padding-bottom: 0.5rem;
}

.glassbox :deep(h1 b) {
  font-size: 2.25rem;
  font-weight: 500;
  display: block;
}

.glassbox :deep(p) {
  color: white;
  font-size: 1rem;
  font-weight: 300;
  line-height: normal;
}
</style>
