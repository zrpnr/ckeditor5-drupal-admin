<template>
  <div class="ckeditor5-toolbar--disabled">
    <div class="ckeditor5-toolbar-available">
      <label for="ckeditor5-toolbar-available__buttons">Available buttons</label>
      <draggable
        class="ckeditor5-toolbar__tray ckeditor5-toolbar-available__buttons"
        tag="ul"
        :list="listAvailable"
        :group="group"
        itemKey="id"
      >
        <template #item="{ element }">
          <ToolbarButton
            :id="element.id"
            :name="element.name"
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
        :list="dividers"
        :group="{ name: 'toolbar', put: false, pull: 'clone', sort: 'false' }"
        itemKey="id"
        :clone="makeCopy"
      >
        <template #item="{ element }">
          <ToolbarButton
            :id="element.id"
            :name="element.name"
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
      :group="group"
      itemKey="id"
    >
      <template #item="{ element }">
        <ToolbarButton
          :id="element.id"
          :name="element.name"
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

const props = defineProps({
  announcements: Object
});

const { announcements } = props;

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
const dividers = [{ name: "|", id: "divider" }, { name: "-", id: "wrapping" }];
const selectedButtons = [...selectedToolbar.toolbar];
const availableButtons = availableToolbar.toolbar.filter(
  (item) => !selectedButtons.includes(item)
);

const mapButtons = (name) => (
  dividers.find((divider) => divider.name == name) ?? { name, id: name }
);

// Create reactive lists.
const listSelected = shallowReactive(selectedButtons.map(mapButtons));
const listAvailable = shallowReactive(availableButtons.map(mapButtons));

// Without a copy, select by index would return an lower duplicate.
const makeCopy = (original) => (Object.assign({}, original));

const copyToList = (from, to, element) => {
  to.push(makeCopy(element));
}
const moveToList = (from, to, element) => {
  to.push(element);
  from.splice(from.indexOf(element), 1);
}

const moveInList = (list, element, dir) => {
  const index = list.indexOf(element);
  // If moving up, check it is not the first, else check it is not the last.
  const condition = dir < 0 ? index > 0 : index < list.length - 1;
  if (condition) {
    list.splice(index + dir, 0, list.splice(index, 1)[0]);
  }
}

const moveUpList = (list, element) => {
  moveInList(list, element, -1);
}

const moveDnList = (list, element) => {
  moveInList(list, element, 1);
}

const onFocusDisabled = (element) => {
  if (announcements && announcements.onFocusDisabled) {
    announcements.onFocusDisabled(element.id);
  }
}

const onFocusActive = (element) => {
  if (announcements && announcements.onFocusActive) {
    announcements.onFocusActive(element.id, listAvailable.indexOf(element) + 1, listAvailable.length);
  }
}

// Stringified version for submitting in #buttons-selected.
const selectedItems = computed(() => `[${listSelected.map((item) => `"${item.name}"`).join(',')}]`);

// Update textarea
watch(() => selectedItems.value, (currSelected, prevSelected) => {
  selected.value = currSelected;
});
</script>
