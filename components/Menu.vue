<script setup>
const { data } = await useFetch("/api/contentful", {
  query: { contentType: "menu", include: 3 },
  fresh: true,
});

const allEntries = data.value.includes?.Entry ?? [];

const menu = data.value.items[0].fields.menuSektioner.map((sektionLink) => {
  const sektion = allEntries.find((e) => e.sys.id === sektionLink.sys.id);

  const resolvedItems = sektion.fields.menuGenstande.map((itemLink) =>
    allEntries.find((e) => e.sys.id === itemLink.sys.id),
  );

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
});

console.log(data.value);
</script>

<template>
  <div class="menucard-wrapper">
    <h2>Menukort</h2>
    <table v-for="sektion in menu" :key="sektion.titel" class="menucard">
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
</template>

<style scoped>
.beskrivelse {
  display: block;
  font-size: 0.8rem;
}

.menucard {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 4rem;
}

.menucard-wrapper {
  width: 100%;

  h2 {
    margin-bottom: 15px;
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

@media screen and (min-width: 600px) {
  .menucard {
    margin: 0 auto 3rem auto;
    width: 600px;
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
}
</style>
