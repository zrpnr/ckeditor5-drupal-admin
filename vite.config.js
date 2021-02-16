import vue from '@vitejs/plugin-vue'
const path = require('path')

/**
 * https://vitejs.dev/config/
 * @type {import('vite').UserConfig}
 */
export default {
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      name: 'CKEditor5Admin',
    },
    rollupOptions: {
      external: ['sortablejs', 'vue'],
      output: {
        globals: {
          sortablejs: 'Sortable',
          vue: 'Vue',
        }
      },
    }
  }
}
