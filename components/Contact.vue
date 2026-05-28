<script setup>
const props = defineProps({
  Contact: {
    type: Array,
    required: true,
  },
});
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
