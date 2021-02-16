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
