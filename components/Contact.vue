<script setup>
const { data } = await useFetch("/api/contentful", {
  query: { contentType: "kontakt", include: 1 },
  fresh: true,
});

const Contact = computed(
  () =>
    data.value?.items
      ?.map((entry) => ({
        text: entry.fields.tekst,
        phone: entry.fields.telefonnummer,
        mail: entry.fields.email,
        order: entry.fields.rkkeflge,
      }))
      .sort((a, b) => a.order - b.order) ?? [],
);
</script>
<template>
  <h2>Kontakt</h2>
  <div v-for="item in Contact" :key="item.text" class="contact-row">
    <span class="contact-text">{{ item.text }}</span>

    <span v-if="item.mail">
      <a :href="`mailto:${item.mail}`">{{ item.mail }}</a>
    </span>

    <span v-else-if="item.phone">
      <a :href="`tel:${item.phone}`">{{ item.phone }}</a>
    </span>
  </div>
</template>
<style scoped>
.contact-row {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  margin-bottom: 6px;
}
</style>
