<script setup>
    import { ref } from 'vue';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

    const props = defineProps({
        accordion: {
            type: Array,
            required: true
        }
    })

    const openId = ref(null)

    const toggle = (id) => {
        openId.value = openId.value === id ? null : id
    }

    const contentRefs = ref({})
</script>

<template>
<div class="accordion_wrapper">
    <div v-for="(item, index) in accordion" :key="item.id" :class="['accordion_item', { first: index === 0 }]">
        <button class="accordion_title" @click="toggle(item.id)">
            {{ item.accordionTitle }}
            <FontAwesomeIcon :icon="faAngleDown" :class="{ rotated: openId === item.id }" />
        </button>
        <div :ref="el => { if(el) contentRefs[item.id] = el }" 
             :style="openId === item.id ? { maxHeight: contentRefs[item.id]?.scrollHeight + 'px', paddingBottom: '20px' } : { maxHeight: '0px' }"
             class="accordion_content">
            {{ item.accordionContent }}
        </div>
    </div>
</div>
</template>

<style scoped>
.accordion_item {
  border-bottom: 1px solid black;
}

.accordion_item.first {
  border-top: 1px solid Black;
  border-bottom: 1px solid Black;
}

.accordion_content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.accordion_title{
    font-size: 24px;
    width: 100%;
    background-color: transparent;
    border: none;
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
}

svg {
  transition: transform 0.3s ease;
}

.rotated {
  transform: rotate(180deg);
}
</style>