<script setup>
const props = defineProps({
  mySponser: {
    type: Array,
    required: true,
  },
});
</script>
<template>
  <div class="sponsers mt-2">
    <div v-for="item in mySponser">
      <a :href="item.sponserLink" target="_black" class="sponser_link">
        <img
          :src="item.sponserImage"
          :alt="'Sponser: ' + item.sponserName"
          class="sponser_image"
        />
        {{ item.sponserName }}
      </a>
    </div>
  </div>
</template>
<style scoped>
.sponsers {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 30px;
}

.sponser_link {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: black;
  font-size: 18px;
}

.sponser_image {
  width: 100%;
  height: auto;
  object-fit: cover;
  object-position: center;
}

@media screen and (min-width: 700px) {
  .sponsers {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (min-width: 930px) {
  .sponsers {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
