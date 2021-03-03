export default class Parser {
  dividers = [
    {
      id: "divider",
      name: "|",
      label: "Divider"
    },
    {
      id: "wrapping",
      name: "-",
      label: "Wrapping"
    }
  ];

  constructor({ availableId, selectedId }) {
    const available = document.getElementById(availableId);
    const selected = document.getElementById(selectedId);
    this.selectedTextarea = selected;

    try {
      this.availableJson = JSON.parse(`{"toolbar": ${available.innerHTML} }`);
      this.selectedJson = JSON.parse(`{"toolbar": ${selected.value} }`);
    } catch (err) {
      console.error(err, "Unable to parse JSON toolbar items") 
    }

    // Map the provided object {name: { label: Label }} to { name, id, label }.
    this.available = Object.entries(this.availableJson.toolbar).map(
      ([name, attrs]) => ({ name, id: name, ...attrs})
    );
  }

  /**
   * The textarea is an array of button names only,
   * e.g. ["heading","bold", "|", "imageUpload"]
   * That name must be mapped to the available buttons or dividers.
   */
  getSelectedButtons() {    
    return this.selectedJson.toolbar.map(
      (name) => Object.assign(
        {},
        [...this.dividers, ...this.available].find((button) => button.name === name)
      ),
    );
  }

  /**
   * Available buttons should not include currently selected.
   * Filter the full available list by any names in the textarea.
   */
  getAvailableButtons() {
    return this.available.filter(
      (button) => !this.selectedJson.toolbar.includes(button.name)
    );
  }

  /**
   * Create copy of dividers list, no need to be reactive.
   */
  getDividers() {
    return [...this.dividers];
  }

  /**
   * Set the textarea value.
   * @param {string} selected
   *  The stringified version of the sorted and selected item names.
   */
  setSelected(selected) {
    this.selectedTextarea.value = selected;
  }

}
