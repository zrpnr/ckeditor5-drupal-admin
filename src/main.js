import { createApp } from 'vue'
import App from './App.vue'

// Create a fresh app instance for each mount.
let instance;
const defaultOptions = {
  announcements: {},
  language: { langcode: 'en', dir: 'ltr'},
  toolbarHelp: [],
}

// createApp factory function.
const createAdminApp = (props) => createApp(App, props);
const mountApp = (options) => {
  try {
    instance = createAdminApp(Object.assign(defaultOptions, options));
    instance.mount('#ckeditor5-toolbar-app');
  } catch (error) {
    console.error('Could not mount CKEditor5 admin app', error);
  }
}

const unmountApp = () => {
  try {
    instance.unmount();
  } catch (error) {
    console.error('Could not unmount CKEditor5 admin app', error);
  }
}

// Export as a global for Drupal.behaviors.
export default {
  mountApp,
  unmountApp
};
