import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'virtual-modules',
      resolveId(id) {
        const remotes = ['users/store/users', 'rooms/store/rooms'];
        if (remotes.includes(id)) {
          return `virtual:${id}`;
        }
      },
    },
  ],
  test: {
    environment: 'happy-dom',
    setupFiles: ['vitest.setup.ts'],
  },
});
