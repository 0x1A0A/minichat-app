import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { dependencies } from './package.json';

export default defineConfig({
  plugins: [
    pluginVue(),
    pluginModuleFederation({
      name: 'users',
      exposes: {
        './Login': './src/Login.vue',
        './store/users': './src/store/users.ts',
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
  server: { port: 3001 },
});
