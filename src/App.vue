<template>
  <HelpText :items="toolbarHelpText" />
  <div class="ckeditor5-toolbar-disabled">
    <div class="ckeditor5-toolbar-available">
      <label for="ckeditor5-toolbar-available__buttons">Available buttons</label>
      <draggable
        class="ckeditor5-toolbar-tray ckeditor5-toolbar-available__buttons"
        tag="ul"
        :list="listAvailable"
        group="toolbar"
        itemKey="id"
        @add="onAddToAvailable"
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
        class="ckeditor5-toolbar-tray ckeditor5-toolbar-divider__buttons"
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
              down: () => copyToActiveButtons(dividers, listSelected, element),
              focus: () => onFocusDisabled(element),
            }"
            :alert="() => listSelf('dividers', dividers, element)"
            :divider="true"
          />
        </template>
      </draggable>
    </div>
  </div>
  <div class="ckeditor5-toolbar-active">
    <label for="ckeditor5-toolbar-active__buttons">Active toolbar</label>
    <draggable
      class="ckeditor5-toolbar-tray ckeditor5-toolbar-active__buttons"
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
            up: () => moveToList(listSelected, listAvailable, element, listDividers.map(item => item.id).includes(element.id)),
            [sortUp]: () => moveUpActiveButtons(listSelected, element),
            [sortDn]: () => moveDownActiveButtons(listSelected, element),
            focus: () => onFocusActive(element),
          }"
          :data-divider="listDividers.map(item => item.id).includes(element.id)"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { computed, defineProps, shallowReactive, watch } from 'vue';
import draggable from 'vuedraggable';
import ToolbarButton from './components/ToolbarButton.vue';
import HelpText from './components/HelpText.vue';
import Parser from './parser';
import {
  makeCopy,
  copyToActiveButtons,
  moveToList,
  moveWithinActiveButtons,
  moveUpActiveButtons,
  moveDownActiveButtons,
} from './utils';

const props = defineProps({
  announcements: Object,
  toolbarHelp: Array,
  language: Object,
});

const { announcements, toolbarHelp, language } = props;
const { dir } = language;

const sortUp = dir === 'rtl' ? 'right' : 'left';
const sortDn = dir === 'rtl' ? 'left' : 'right';

const parser = new Parser({
  availableId: 'ckeditor5-toolbar-buttons-available',
  selectedId: 'ckeditor5-toolbar-buttons-selected',
});

const onFocusDisabled = (element) => {
  if (announcements && announcements.onFocusDisabled) {
    announcements.onFocusDisabled(element.label);
  }
};

const onFocusActive = (element) => {
  if (announcements) {
    const index = listSelected.indexOf(element);
    const position = index + 1;
    const length = listSelected.length;

    if (index === 0 && announcements.onFocusActiveFirst) {
      announcements.onFocusActiveFirst(element.label);
    } else if (position === length && announcements.onFocusActiveLast) {
      announcements.onFocusActiveLast(element.label);
    } else {
      if (announcements.onFocusActive) {
        announcements.onFocusActive(element.label, position, length);
      }
    }
  }
};

const onAddToAvailable = (event, two) => {
  // If the moved item is a divider, it should not be added to the available
  // buttons list.
  if (event.item.matches('[data-divider="true"]')) {
    const { newIndex } = event;
    setTimeout(() => {
      // Remove the divider button from the available buttons list. Draggable
      // reassesses the lists during each drag event, so the DOM removal should
      // not be disruptive.
      document.querySelectorAll('.ckeditor5-toolbar-available__buttons li')[newIndex].remove();
    });
  }
}

// Create reactive lists.
const listDividers = parser.getDividers();
const listSelected = shallowReactive(parser.getSelectedButtons());
const listAvailable = shallowReactive(parser.getAvailableButtons());

const toolbarHelpText = computed(() =>
  toolbarHelp
    .filter(
      (helpItem) =>
        listSelected.map((item) => item.name).includes(helpItem.button) ===
        helpItem.condition,
    )
    .map((helpItem) => helpItem.message),
);

// Stringified version for submitting in #buttons-selected.
const selectedItems = computed(
  () => `[${listSelected.map((item) => `"${item.name}"`).join(',')}]`,
);

// Update textarea
watch(
  () => selectedItems.value,
  (currSelected, prevSelected) => {
    parser.setSelected(currSelected);
  },
);
</script>
