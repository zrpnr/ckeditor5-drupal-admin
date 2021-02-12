<template>
  <h2>{{ title }}</h2>  
  <ul>
    <li v-for="item in list" :key="item">{{ item }}</li>
  </ul>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  title: String,
  list: Array
});

</script>

