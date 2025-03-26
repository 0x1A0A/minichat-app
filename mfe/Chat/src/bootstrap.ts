import { createApp } from 'vue';
import App from './App.vue';
import { install } from '@twind/core';
import config from '../twind.config';
import { createPinia } from 'pinia';

install(config);
createApp(App).use(createPinia()).mount('#root');
