import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import {
  ModuleFederationOptions,
  pluginModuleFederation,
} from '@module-federation/rsbuild-plugin';
import { dependencies } from './package.json';

const moduleFederationConfig: ModuleFederationOptions = {
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
};

export default defineConfig({
  plugins: [pluginVue(), pluginModuleFederation(moduleFederationConfig)],
  server: { port: 3003 },
});
