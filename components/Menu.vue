<script setup>
const props = defineProps({
  menuItem: {
    type: Array,
    required: true,
  },
});
</script>
<template>
  <div class="menucard-wrapper">
    <h2>Menukort</h2>
    <table v-for="item in menuItem" :key="item.id" class="menucard">
      <thead>
        <tr>
          <th>{{ item.day }}</th>
          <th>Studiepriser</th>
          <th>Normal pris</th>
        </tr>
      </thead>

      <tbody>
        <template v-for="drink in item.drinks" :key="drink.name">
          <!-- Alcohol label -->
          <tr v-if="drink.alcoholLabel">
            <td colspan="3" class="alcohol-label">
              {{ drink.alcoholLabel }}
            </td>
          </tr>

          <!-- Main drink row -->
          <tr>
            <td>{{ drink.name }}</td>
            <td>{{ drink.studiepris }},-</td>
            <td>{{ drink.normalpris }},-</td>
          </tr>

          <!-- Drinks names -->
          <tr v-if="drink.drinkNames">
            <td colspan="3">
              <ul>
                <li v-for="name in drink.drinkNames" :key="name">
                  {{ name }} /
                </li>
              </ul>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
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
  vertical-align: bottom;
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
