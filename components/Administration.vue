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
  <h2>Administration</h2>
  <p v-for="item in Administration" :key="item.mail">
    {{ item.name }}: <a :href="`mailto:${item.mail}`">{{ item.mail }}</a>
  </p>
</template>
<style scoped></style>
