<script setup>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS } from '@contentful/rich-text-types'

const props = defineProps({
  heading: Object,
  heroTagline: Object,
})

const options = {
  renderNode: {
    [BLOCKS.HEADING_1]: (node, next) => `<h1>${next(node.content)}</h1>`,
    [BLOCKS.HEADING_2]: (node, next) => `<h2>${next(node.content)}</h2>`,
    [BLOCKS.PARAGRAPH]: (node, next) => `<p>${next(node.content)}</p>`,
  }
}

const headingHtml = computed(() => props.heading ? documentToHtmlString(props.heading, options) : '')
const taglineHtml = computed(() => props.heroTagline ? documentToHtmlString(props.heroTagline, options) : '')
</script>

<template>
  <div class="glassbox">
    <div v-html="headingHtml" />
    <div v-html="taglineHtml" />
  </div>
</template>

<style scoped>

.glassbox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 360px;
  height: 322px;
  padding-inline: 40px;
  padding-top: 25px;
  padding-bottom: 40px;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 50px;
  border: 0.25px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 1px 0 0 rgba(255, 255, 255, 0.2);
}

.glassbox :deep(h1) {
  font-size: 2rem;
  font-weight: 300;
  color: white;
  line-height: normal;
  padding-bottom: 0.5rem;
}

.glassbox :deep(h1 b) {
  font-size: 2.25rem;
  font-weight: 500;
  display: block;
}

.glassbox :deep(p) {
  color: white;
  font-size: 1rem;
  font-weight: 300;
  line-height: normal;
}

.glassbox :deep(p:nth-child(1)) {
  padding-bottom: 1rem;
}

@media (min-width: 500px) {
  .glassbox {
    width: calc(100% - 30px);
    max-width: 500px;
    height: auto;
  }
}

@media (min-width: 992px) {
  .glassbox {
    max-width: none;
    top: auto;
    left: 80px;
    bottom: 40px;
    transform: none;
    width: 500px;
    height: 400px;
    padding: 40px;
    border-radius: 50px;
  }

  .glassbox :deep(h1) {
    font-size: 3rem;
    padding-bottom: 1.2rem;
  }

  .glassbox :deep(h1 b) {
    font-size: 3rem;
  }

  .glassbox :deep(p) {
    font-size: 1.2rem;
  }
}

@media (min-width: 1510px) {
  .glassbox {
    bottom: 40px;
    left: 150px;
    width: 663px;
    height: 553px;
    padding: 50px;
    border-radius: 50px;
  }

  .glassbox :deep(h1) {
    font-size: 4.375rem;
    padding-bottom: 1.5rem;
  }

  .glassbox :deep(h1 b) {
    font-size: 4.375rem;
  }

  .glassbox :deep(p) {
    font-size: 1.5rem;
  }
}
</style>