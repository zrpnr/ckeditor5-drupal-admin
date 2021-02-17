<template>
  <div class="ckeditor5-toolbar--disabled">
    <div class="ckeditor5-toolbar-available">
      <label for="ckeditor5-toolbar-available__buttons"
        >Available buttons</label
      >
      <draggable
        class="ckeditor5-toolbar__tray ckeditor5-toolbar-available__buttons"
        tag="ul"
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
        class="ckeditor5-toolbar__tray ckeditor5-toolbar-divider__buttons"
        tag="ul"
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
      class="ckeditor5-toolbar__tray ckeditor5-toolbar-active__buttons"
      tag="ul"
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
const available = document.getElementById("ckeditor5-toolbar__buttons-available");
const selected = document.getElementById("ckeditor5-toolbar__buttons-selected");
const selectedField = document.querySelector('.form-item-editor-settings-toolbar-items');
[available, selected, selectedField].forEach((el) => {
  if (el) {
    el.style.display = "none";
  }
});

// @todo: validate the provided values.
const availableToolbar = JSON.parse(`{"toolbar": ${available.innerHTML} }`);
const selectedToolbar = JSON.parse(`{"toolbar": ${selected.value} }`);


// basic setup
const group = "toolbar";
const dividers = [{ name: "|", id: "divider" }, { name: "-", id: 'wrapping' }];
const selectedButtons = [...selectedToolbar.toolbar];
const availableButtons = availableToolbar.toolbar.filter((item) => !selectedButtons.includes(item));

const mapButtons = (name) => {
  return dividers.find((divider) => divider.name == name) ?? { name, id: name }; 
}

const listSelected = ref(selectedButtons.map(mapButtons));
const listAvailable = ref(availableButtons.map(mapButtons));

// Stringified version for submitting in #buttons-selected.
const selectedItems = computed(() => `[${listSelected.value.map((item) => `"${item.name}"`).join(',')}]`);

// Update textarea
watch(() => selectedItems.value, (currSelected, prevSelected) => {
  selected.value = currSelected;
});
</script>
