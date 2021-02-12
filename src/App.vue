<template>
  <Toolbar :title="titleAvailable" :list="listAvailable" />
  <Toolbar :title="titleSelected" :list="listSelected" />
</template>

<script setup>
  import Toolbar from './components/Toolbar.vue';
  import { computed } from 'vue';
  
  // init
  const available = document.getElementById('buttons-available');
  const selected = document.getElementById('buttons-selected');

  const availableToolbar = JSON.parse(`{"toolbar": ${available.innerHTML} }`);
  const selectedToolbar = JSON.parse(`{"toolbar": ${selected.value} }`);
  [available, selected].forEach((el) => {
    el.style.visibility = 'hidden';
  });

  // basic setup
  const titleAvailable = "Available buttons";
  const listAvailable = computed(() => {
    return availableToolbar.toolbar.filter((item) => !selectedToolbar.toolbar.includes(item));
  });

  const titleSelected = "Selected Toolbar buttons"
  const listSelected = selectedToolbar.toolbar;

</script>