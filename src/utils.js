
export const makeCopy = (original) => Object.assign({}, original);

export const copyToList = (from, to, element) => {
  to.push(makeCopy(element));
}
export const moveToList = (from, to, element) => {
  to.push(element);
  from.splice(from.indexOf(element), 1);
}

export const moveInList = (list, element, dir) => {
  const index = list.indexOf(element);
  // If moving up, check it is not the first, else check it is not the last.
  const condition = dir < 0 ? index > 0 : index < list.length - 1;
  if (condition) {
    list.splice(index + dir, 0, list.splice(index, 1)[0]);
  }
}

export const moveUpList = (list, element) => {
  moveInList(list, element, -1);
}

export const moveDnList = (list, element) => {
  moveInList(list, element, 1);
}
