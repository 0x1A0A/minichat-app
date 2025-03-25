# How to start a new mfe

this project is using pnpm and rsbuild.

init new rsbuild.

```
pnpm create rsbuild@latest
```

add default dependencies.

```
pnpm add @vueuse/core pinia @twind/{core,preset-{autoprefix,tailwind}} @module-federation/enhanced
pnpm add @vue/language-server @module-federation/rsbuild-plugin --save-dev
```

add twind.config.ts

```
import { defineConfig } from '@twind/core';
import presetAutoprefix from '@twind/preset-autoprefix';
import presetTailwind from '@twind/preset-tailwind';

export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind()],
});
```

edit your rsbuild

```
import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { dependencies } from './package.json';

export default defineConfig({
  plugins: [
    pluginVue(),
    pluginModuleFederation({
      name: <mfe-name>,
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
  server: { port: <mfe-port> },
});
```

add bootstrap.ts file -- this act as you main entry

```
import { createApp } from 'vue';
import App from './App.vue';
import { install } from '@twind/core';
import config from '../twind.config';
import { createPinia } from 'pinia';

install(config);
createApp(App).use(createPinia()).mount('#root');
```

now edit in your index.ts to import bootstrap file -- to make app start as async I guess?

```
import('./bootstrap');
```
