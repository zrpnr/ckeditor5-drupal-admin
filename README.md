# ckeditor5-drupal-admin
Drupal admin for CKEditor5

This is a prototype Toolbar button UI for CKEditor 5 in Drupal.

It uses Vue for state management, and Sortable.js for dragging and sorting buttons.

## Development

* `npm run dev` to open a page at localhost:3000

## Accessibility

This app features keyboard controls, when a button is focused it may be toggled between the inactive and active lists.
The down key moves an item into the active toolbar, and from the active toolbar the up key moves an item out.
While in the active list, the left and right arrows are used to move an item up or down the order.

To support Drupal.announce, an object may be passed to the app as props. This object should have an `announce` key,
and each function should be keyed by the event name.

* onFocusDisabled (itemLabel) - User focuses an item in the "avilable" or "dividers" list
* onFocusActive (itemLabel, position, listCount) - User focuses an item in the "active" list