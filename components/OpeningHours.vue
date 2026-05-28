<script setup>
defineProps({
  openingHours: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="opening-hours">
    <p class="footer_heading">Åbningstider</p>
    <div v-for="item in openingHours" :key="item.day" class="hours_row">
      <span>{{ item.day }}:</span>
      <span>{{ item.opening }} - {{ item.closing }}</span>
    </div>
  </div>
</template>

<style scoped>
.opening-hours {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* THIS is what fixes your layout */
.hours_row {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  line-height: 1.8;
}

.day {
  min-width: 90px;
}

.time {
  text-align: right;
}
</style>
