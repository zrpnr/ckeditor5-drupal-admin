
export const makeCopy = (original) => Object.assign({}, original);

export const copyToActiveButtons = (from, to, element) => {
  to.push(makeCopy(element));
  setTimeout(() => {
    // A divider added to active buttons will be the last item in the list.
    // Focus that item.
    document.querySelector('.ckeditor5-toolbar-active__buttons li:last-child a').focus();
  });
}

const setFocus = (element) => {
  setTimeout(()=> {
    document.querySelector(`#${element.id}-button`).focus();
  })
}

export const moveToList = (from, to, element, divider = false) => {
  const elementIndex = from.indexOf(element);
  if (!divider) {
    to.push(element);
    setFocus(element);
  } else {
    // If this is a divider, then this is being called to remove it from the
    // active buttons list. Focus the item to the left of the removed divider.
    setTimeout(() => {
      document.querySelector(`.ckeditor5-toolbar-active__buttons li:nth-child(${Math.max(elementIndex, 0)}) a`).focus();
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
      document.querySelectorAll(`.ckeditor5-toolbar-active__buttons li`)[index + dir].querySelector('a').focus();
    });
  }
}

export const moveUpActiveButtons = (list, element) => {
  moveWithinActiveButtons(list, element, -1);
}

export const moveDownActiveButtons = (list, element) => {
  moveWithinActiveButtons(list, element, 1);
}
