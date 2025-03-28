import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import {
  ModuleFederationOptions,
  pluginModuleFederation,
} from '@module-federation/rsbuild-plugin';
import { dependencies } from './package.json';

const moduleFederationConfig: ModuleFederationOptions = {
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
};

export default defineConfig({
  plugins: [pluginVue(), pluginModuleFederation(moduleFederationConfig)],
  server: { port: 3001, base: '/user' },
});
