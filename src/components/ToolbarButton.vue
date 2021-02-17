<template>
  <li>
    <button
      :title="name"
      role="button"
      :class="selector"
      aria-describedby="tooltip"
      :aria-expanded="isExpanded"
      v-on:click="selectButton"
      v-on:focus="expand"
      v-on:mouseover="expand"
      v-on:mouseout="hide"
      v-on:blur="hide"
      @keyup.esc="hide"
      tabindex="0"
    >
      <span class="visually-hidden" aria-hidden="true">{{ name }}</span>
    </button>
    <span class="ckeditor5-toolbar__tooltip" role="tooltip">{{ name }}</span>
  </li>
</template>

<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps({
  name: String,
  id: String,
});

const isExpanded = ref(false);

const expand = () => {
  isExpanded.value = true;
}
const hide = () => {
  isExpanded.value = false;
}
const toggle = () => {
  isExpanded.value = !isExpanded.value;
}
const selectButton = (event) => {
  console.log(event, isExpanded);
  if (event) {
    event.preventDefault();
    toggle();
  }
}

const id = `ckeditor5-toolbar__button-${props.id}`;
const selector = `ckeditor5-toolbar__button ${id}`;
const tooltip = `ckeditor5-toolbar__tooltip-${props.id}`

</script>
