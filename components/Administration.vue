<script setup>
const props = defineProps({
  Administration: {
    type: Array,
    required: true,
  },
});

console.log(props.Administration);
</script>
<template>
  <h2>Administration</h2>
  <p v-for="item in props.Administration" :key="item.mail">
    {{ item.name }}: <a :href="`mailto:${item.mail}`">{{ item.mail }}</a>
  </p>
</template>
<style scoped></style>
