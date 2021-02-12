<template>
  <div class="ckeditor5-toolbar--disabled">
    <div class="ckeditor5-toolbar-available">
      <label for="ckeditor5-toolbar-available__buttons"
        >Available buttons</label
      >
      <draggable
        class="ckeditor5-toolbar-available__buttons"
        :list="listAvailable"
        :group="group"
        itemKey="id"
      >
        <template #item="{ element }">
          <ToolbarButton :id="element.id" :name="element.name" />
        </template>
      </draggable>
    </div>
    <div class="ckeditor5-toolbar-divider">
      <label for="ckeditor5-toolbar-divider__buttons"
        >Button divider</label
      >
      <draggable
        class="ckeditor5-toolbar-divider__buttons"
        :list="dividers"
        :group="{ name: 'toolbar', put: false, pull: 'clone', sort: 'false' }"
        itemKey="id"
      >
        <template #item="{ element }">
          <ToolbarButton :id="element.id" :name="element.name" />
        </template>
      </draggable>
    </div>
  </div>
  <div class="ckeditor5-toolbar-active">
    <label for="ckeditor5-toolbar-active__buttons">Active toolbar</label>
    <draggable
      class="ckeditor5-toolbar-active__buttons"
      :list="listSelected"
      :group="group"
      itemKey="id"
    >
      <template #item="{ element }">
        <ToolbarButton :id="element.id" :name="element.name" />
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import draggable from "vuedraggable";
import ToolbarButton from './components/ToolbarButton.vue';

// init
const available = document.getElementById("buttons-available");
const selected = document.getElementById("buttons-selected");
[available, selected].forEach((el) => {
  el.style.visibility = "hidden";
});

// @todo: validate the provided values.
const availableToolbar = JSON.parse(`{"toolbar": ${available.innerHTML} }`);
const selectedToolbar = JSON.parse(`{"toolbar": ${selected.value} }`);


// basic setup
const group = "toolbar";
const dividers = [{ name: "|", id: "divider" }, { name: "-", id: 'wrapping' }];
const selectedButtons = [...selectedToolbar.toolbar];
const availableButtons = availableToolbar.toolbar.filter((item) => !selectedButtons.includes(item));

const listSelected = ref(selectedButtons.map((item) => ({ name: item, id: item })));
const listAvailable = ref(availableButtons.map((item) => ({ name: item, id: item })));

// Stringified version for submitting in #buttons-selected.
const selectedItems = computed(() => `[${listSelected.value.map((item) => `"${item.name}"`).join(',')}]`);

// Update textarea
watch(() => selectedItems.value, (currSelected, prevSelected) => {
  selected.value = currSelected;
});
</script>

<style scoped>
  .ckeditor5-toolbar--disabled {
    margin-bottom: 2rem;
    display: flex;
    gap: 2rem;
  }
</style>