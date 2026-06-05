<script setup>
const { data } = await useFetch("/api/contentful", {
  query: { contentType: "administration", include: 1 },
  fresh: true,
});

const Administration = computed(
  () =>
    data.value?.items
      ?.map((entry) => ({
        name: entry.fields.titelMNavn,
        mail: entry.fields.email,
        sort: entry.fields.rkkeflge,
      }))
      .sort((a, b) => a.order - b.order) ?? [],
);
</script>
<template>
  <h2 class="smaller_headline">Administration</h2>
  <p v-for="item in Administration" :key="item.mail" class="section">
    {{ item.name }}: <a :href="`mailto:${item.mail}`">{{ item.mail }}</a>
  </p>
</template>
<style scoped>
.section {
  * {
    font-family: "Inter", sans-serif;
  }
}

p {
  padding: 5px 0;
}
</style>
