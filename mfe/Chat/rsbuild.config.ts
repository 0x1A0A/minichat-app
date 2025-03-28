import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import {
  ModuleFederationOptions,
  pluginModuleFederation,
} from '@module-federation/rsbuild-plugin';
import { dependencies } from './package.json';

const MFE_SERVER = process.env.MFE_SERVER;
function mfe_target(name: string, port: number) {
  if (MFE_SERVER) {
    return `${MFE_SERVER}/${name}`;
  }

  return `http://localhost:${port}/${name}`;
}

const moduleFederationConfig: ModuleFederationOptions = {
  name: 'chat',
  remotes: {
    users: `users@${mfe_target('user', 3001)}/mf-manifest.json`,
    rooms: `rooms@${mfe_target('room', 3002)}/mf-manifest.json`,
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
  server: { port: 3003, base: '/chat' },
});
