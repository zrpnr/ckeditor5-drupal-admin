<template>
  <span :class="selector">{{ name }}</span>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  name: String,
  id: String,
});

const selector = `ckeditor5-toolbar__button ckeditor5-toolbar__button-${props.id}`;

</script>

<style scoped>
.ckeditor5-toolbar__button {
  display: inline-block;
  margin: 0 .2rem;
  padding: .2rem .4rem;
  background: #eee;
  border: 1px solid #999;
  border-radius: 4px;
  cursor: grab;
}
</style>