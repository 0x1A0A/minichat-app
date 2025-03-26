# How to start a new mfe

this project is using pnpm and rsbuild.

## Rsbuild

init new rsbuild.

```
pnpm create rsbuild@latest
```

## deps

### vue and module federation

add default dependencies.

```
pnpm add @vueuse/core pinia @twind/{core,preset-{autoprefix,tailwind}} @module-federation/enhanced
pnpm add @vue/language-server @module-federation/rsbuild-plugin --save-dev
```

### unit testing / vitest

for unit testing. this is what I use.

```
pnpm add -D vitest @testing-library/vue happy-dom @vitejs/plugin-vue
# if you also need test coverage
pnpm add -D @vitest/coverage-v8
# this is helpful if you need to simulate user interaction
pnpm add -D @testing-library/user-event
```

add vitest.setup.ts for setting up test.

```
import { beforeEach } from 'vitest';
import { cleanup } from '@testing-library/vue';

beforeEach(() => {
  cleanup();
});
```

finally add vitest.config.ts

```
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['vitest.setup.ts'],
  },
});
```

I also recommeded to add vitest to your test script.

### twind for css component

add twind.config.ts

```
import { defineConfig } from '@twind/core';
import presetAutoprefix from '@twind/preset-autoprefix';
import presetTailwind from '@twind/preset-tailwind';

export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind()],
});
```

## configuration

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

recommended to remove --open in dev script.

```
"dev": "rsbuild dev",
```
