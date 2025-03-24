<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from 'users/store/users';

import Login from 'users/Login';
import Navbar from './components/Navbar.vue';

const user = useUserStore();
const { verified } = storeToRefs(user);
</script>

<template>
  <template v-if="!verified">
    <div
      class="transition-all w-screen h-screen flex justify-center items-center"
    >
      <Login />
    </div>
  </template>
  <template v-else>
    <Navbar />
  </template>
</template>
