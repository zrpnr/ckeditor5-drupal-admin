<template>
  <div aria-live="polite">
    <p v-for="(item, index) in items" :key="index">{{ item }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  items: Array,
});
</script>