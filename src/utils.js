export const makeCopy = (original) => Object.assign({}, original);

export const copyToActiveButtons = (from, to, element, announceChange) => {
  to.push(makeCopy(element));
  setTimeout(() => {
    // A divider added to active buttons will be the last item in the list.
    // Focus that item.
    document.querySelector('.ckeditor5-toolbar-active__buttons li:last-child').focus();
    if (announceChange) {
      announceChange(element.label);
    }
  });
}

export const moveToList = (from, to, element, announceChange, divider = false, toActive = true) => {
  const elementIndex = from.indexOf(element);

  if (!divider) {
    to.push(element);
    // The selector for the list being moved to is determined by seeing if the
    // element is being moved to the active or available button list.
    const selector = toActive ? '.ckeditor5-toolbar-active__buttons' : '.ckeditor5-toolbar-available__buttons';
    setTimeout(() => {
      document.querySelector(`${selector} li:last-child`).focus();
    });
  } else {
    // If this is a divider, then this is being called to remove it from the
    // active buttons list. Focus the item to the left of the removed divider.
    setTimeout(() => {
      document.querySelector(`.ckeditor5-toolbar-active__buttons li:nth-child(${Math.max(elementIndex, 0)})`).focus();
    });
  }
  if (announceChange) {
    setTimeout(() => {
      announceChange(element.label);
    });
  }
  from.splice(from.indexOf(element), 1);
}

export const moveWithinActiveButtons = (list, element, dir) => {
  const index = list.indexOf(element);
  // If moving up, check it is not the first, else check it is not the last.
  const condition = dir < 0 ? index > 0 : index < list.length - 1;
  if (condition) {
    list.splice(index + dir, 0, list.splice(index, 1)[0]);
    // After rendering, focus the element that was just moved.
    setTimeout(() => {
      document.querySelectorAll(`.ckeditor5-toolbar-active__buttons li`)[index + dir].focus();
    });
  }
}

export const moveUpActiveButtons = (list, element) => {
  moveWithinActiveButtons(list, element, -1);
}

export const moveDownActiveButtons = (list, element) => {
  moveWithinActiveButtons(list, element, 1);
}
