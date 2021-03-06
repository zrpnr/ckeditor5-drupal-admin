<template>
  <HelpText :items="toolbarHelpText" />
  <div class="ckeditor5-toolbar-disabled">
    <div class="ckeditor5-toolbar-available">
      <label id="ckeditor5-toolbar-available__buttons-label">Available buttons</label>
      <draggable
        class="ckeditor5-toolbar-tray ckeditor5-toolbar-available__buttons"
        tag="ul"
        :list="listAvailable"
        group="toolbar"
        itemKey="id"
        @add="onAddToAvailable"
        data-button-list="ckeditor5-toolbar-available__buttons"
      >
        <template #item="{ element }">
          <ToolbarButton
            :id="element.id"
            :name="element.name"
            :label="element.label"
            :actions="{
              down: () => moveToList(listAvailable, listSelected, element, announcements.onButtonMovedActive),
            }"
            listType="available"
          />
        </template>
      </draggable>
    </div>
    <div class="ckeditor5-toolbar-divider">
      <label id="ckeditor5-toolbar-divider__buttons-label">Button divider</label>
      <draggable
        class="ckeditor5-toolbar-tray ckeditor5-toolbar-divider__buttons"
        tag="ul"
        :list="listDividers"
        :group="{ name: 'toolbar', put: false, pull: 'clone', sort: 'false' }"
        itemKey="id"
        :clone="makeCopy"
        data-button-list="ckeditor5-toolbar-divider__buttons"
      >
        <template #item="{ element }">
          <ToolbarButton
            :id="element.id"
            :name="element.name"
            :label="element.label"
            :actions="{
              down: () => copyToActiveButtons(dividers, listSelected, element, announcements.onButtonCopiedActive),
            }"
            :alert="() => listSelf('dividers', dividers, element)"
            data-divider="true"
            listType="available"
          />
        </template>
      </draggable>
    </div>
  </div>
  <div class="ckeditor5-toolbar-active">
    <label id="ckeditor5-toolbar-active__buttons-label">Active toolbar</label>
    <draggable
      class="ckeditor5-toolbar-tray ckeditor5-toolbar-active__buttons"
      tag="ul"
      :list="listSelected"
      group="toolbar"
      itemKey="id"
      data-button-list="ckeditor5-toolbar-active__buttons"
    >
      <template #item="{ element }">
        <ToolbarButton
          :id="element.id"
          :name="element.name"
          :label="element.label"
          :actions="{
            up: () => moveToList(listSelected, listAvailable, element, announcements.onButtonMovedInactive, listDividers.map(item => item.id).includes(element.id), false),
            [sortUp]: () => moveUpActiveButtons(listSelected, element),
            [sortDn]: () => moveDownActiveButtons(listSelected, element),
          }"
          :data-divider="listDividers.map(item => item.id).includes(element.id)"
          listType="active"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { computed, defineProps, shallowReactive, watch, onMounted } from 'vue';
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

const onAddToAvailable = (event) => {
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

// @todo add these attributes directly to the sortable list when
//    https://github.com/SortableJS/vue.draggable.next/pull/35 lands.
//    onMounted and onUpdated can be removed as well if their only purpose is
//    calling this function.
const updateRoles = () => {
  document.querySelectorAll('[data-button-list]').forEach((list) => {
    const buttonListId = list.getAttribute('data-button-list');
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-orientation', 'horizontal');
    list.setAttribute('aria-labelledby', `${buttonListId}-label`)
  });
}

onMounted(() => {
  updateRoles()
});
</script>
