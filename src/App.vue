<template>
  <div class="ckeditor5-toolbar--disabled">
    <div class="ckeditor5-toolbar-available">
      <label for="ckeditor5-toolbar-available__buttons">Available buttons</label>
      <draggable
        class="ckeditor5-toolbar__tray ckeditor5-toolbar-available__buttons"
        tag="ul"
        :list="listAvailable"
        group="toolbar"
        itemKey="id"
      >
        <template #item="{ element }">
          <ToolbarButton
            :id="element.id"
            :name="element.name"
            :label="element.label"
            :actions="{
              down: () => moveToList(listAvailable, listSelected, element),
              focus: () => onFocusDisabled(element),
            }"
          />
        </template>
      </draggable>
    </div>
    <div class="ckeditor5-toolbar-divider">
      <label for="ckeditor5-toolbar-divider__buttons">Button divider</label>
      <draggable
        class="ckeditor5-toolbar__tray ckeditor5-toolbar-divider__buttons"
        tag="ul"
        :list="listDividers"
        :group="{ name: 'toolbar', put: false, pull: 'clone', sort: 'false' }"
        itemKey="id"
        :clone="makeCopy"
      >
        <template #item="{ element }">
          <ToolbarButton
            :id="element.id"
            :name="element.name"
            :label="element.label"
            :actions="{
              down: () => copyToList(dividers, listSelected, element),
              focus: () => onFocusDisabled(element),
            }"
            :alert="() => listSelf('dividers', dividers, element)"
          />
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
      group="toolbar"
      itemKey="id"
    >
      <template #item="{ element }">
        <ToolbarButton
          :id="element.id"
          :name="element.name"
          :label="element.label"
          :actions="{
            up: () => moveToList(listSelected, listAvailable, element),
            left: () => moveUpList(listSelected, element),
            right: () => moveDnList(listSelected, element),
            focus: () => onFocusActive(element),
          }"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { computed, defineProps, shallowReactive, watch } from "vue";
import draggable from "vuedraggable";
import ToolbarButton from './components/ToolbarButton.vue';
import Parser from './parser';
import {
  makeCopy,
  copyToList,
  moveToList,
  moveInList,
  moveUpList,
  moveDnList
} from './utils';

const props = defineProps({
  announcements: Object
});

const { announcements } = props;

const parser = new Parser({
  availableId: 'ckeditor5-toolbar__buttons-available',
  selectedId: 'ckeditor5-toolbar__buttons-selected'
});

const onFocusDisabled = (element) => {
  if (announcements && announcements.onFocusDisabled) {
    announcements.onFocusDisabled(element.label);
  }
}

const onFocusActive = (element) => {
  if (announcements) {
    const index = listSelected.indexOf(element);
    const position = index + 1;
    const length = listSelected.length;

    if (index === 0 && announcements.onFocusActiveFirst) {
      announcements.onFocusActiveFirst(element.label);
    }
    else if (position === length && announcements.onFocusActiveLast) {
      announcements.onFocusActiveLast(element.label);
    }
    else {
      if (announcements.onFocusActive) {
        announcements.onFocusActive(element.label, position, length);
      }
    }
  }
}

// Create reactive lists.
const listDividers = parser.getDividers();
const listSelected = shallowReactive(parser.getSelectedButtons());
const listAvailable = shallowReactive(parser.getAvailableButtons());

// Stringified version for submitting in #buttons-selected.
const selectedItems = computed(() => `[${listSelected.map((item) => `"${item.name}"`).join(',')}]`);

// Update textarea
watch(() => selectedItems.value, (currSelected, prevSelected) => {
  parser.setSelected(currSelected);
});
</script>
