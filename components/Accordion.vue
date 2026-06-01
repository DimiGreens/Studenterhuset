<script setup>
// Vi importere nødvendige ikoner samt ref fra Vue
import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

const { data } = await useFetch("/api/contentful", {
  query: { contentType: "faq", include: 1 },
  fresh: true,
});

const accordion = computed(() =>
  data.value?.items?.map((entry) => ({
    id: entry.sys.id,
    accordionTitle: entry.fields.titel,
    accordionContent: documentToHtmlString(entry.fields.indhold),
  })),
);

// Reaktiv variabel der holder styr på hvilket accordion-element der er åbent
const openId = ref(null);

// Funktion der toggler åbning/lukning af et accordion-element via dets id
const toggle = (id) => {
  openId.value = openId.value === id ? null : id;
};

// Indeholder referencer til accordion-elementernes indhold
const contentRefs = ref({});
</script>

<template>
  <div class="accordion_wrapper">
    <div
      v-for="(item, index) in accordion"
      :key="item.id"
      :class="['accordion_item', { first: index === 0 }]"
    >
      <button class="accordion_title" @click="toggle(item.id)">
        {{ item.accordionTitle }}
        <FontAwesomeIcon
          :icon="faAngleDown"
          :class="{ rotated: openId === item.id }"
        />
      </button>
      <div
        :ref="
          (el) => {
            if (el) contentRefs[item.id] = el;
          }
        "
        :style="
          openId === item.id
            ? {
                maxHeight: contentRefs[item.id]?.scrollHeight + 'px',
                paddingBottom: '20px',
              }
            : { maxHeight: '0px' }
        "
        class="accordion_content"
        v-html="item.accordionContent"
      ></div>
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

.accordion_title {
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
