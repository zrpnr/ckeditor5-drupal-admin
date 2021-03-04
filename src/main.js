import { createApp } from 'vue'
import App from './App.vue'

// Create a fresh app instance for each mount.
let instance;

// createApp factory function.
const createAdminApp = (props) => createApp(App, props);

const mountApp = (options, language = { langcode: 'en', dir: 'ltr' }) => {
  try {
    instance = createAdminApp(options, language);
    instance.mount('#ckeditor5-toolbar__app');
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
