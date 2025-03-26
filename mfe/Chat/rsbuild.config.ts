import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { dependencies } from './package.json';

export default defineConfig({
  plugins: [
    pluginVue(),
    pluginModuleFederation({
      name: 'chat',
      remotes: {
        users: 'users@http://localhost:3001/mf-manifest.json',
        rooms: 'rooms@http://localhost:3002/mf-manifest.json',
      },
      exposes: {
        './Messages': './src/components/MessageBox.vue',
      },
      shared: {
        vue: {
          singleton: true,
          eager: true,
          requiredVersion: dependencies.vue,
        },
        pinia: { singleton: true, eager: true },
      },
      dts: {
        generateTypes: { compilerInstance: 'vue-tsc' },
      },
    }),
  ],
  server: { port: 3003 },
});
