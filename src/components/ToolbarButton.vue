<template>
  <li :class="itemSelector" v-on:mouseover="expand" v-on:mouseout="hide">
    <a
      :class="buttonSelector"
      role="button"
      href=""
      :aria-describedby="tooltip"
      :aria-expanded="isExpanded"
      v-on:click.prevent="selectButton"
      v-on:focus="expand"
      v-on:blur="hide"
      @keyup.esc="hide"
      @keyup.up="move('up')"
      @keyup.down="move('down')"
      @keyup.left="move('left')"
      @keyup.right="move('right')"
    >
      <span class="visually-hidden" aria-hidden="true">{{ label }}</span>
    </a>
    <span :id="tooltip" class="ckeditor5-toolbar-tooltip" role="tooltip">{{ label }}</span>
  </li>
</template>

<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps({
  name: String,
  label: String,
  id: String,
  actions: Object,
});

const isExpanded = ref(false);

const expand = () => {
  isExpanded.value = true;
  if (props.actions.focus) {
    props.actions.focus();
  }
}
const hide = () => {
  isExpanded.value = false;
}
const toggle = () => {
  isExpanded.value = !isExpanded.value;
}
const selectButton = () => {
  toggle();
}

const move = (dir) => {
  if (props.actions[dir]) {
    props.actions[dir]();
  }
}

const itemSelector = `ckeditor5-toolbar-item ckeditor5-toolbar-item-${props.id}`;
const buttonSelector = `ckeditor5-toolbar-button ckeditor5-toolbar-button-${props.id}`;
const tooltip = `ckeditor5-toolbar-tooltip-${props.id}`

</script>
