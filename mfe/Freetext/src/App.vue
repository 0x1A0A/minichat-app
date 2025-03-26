<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from 'users/store/users';

import Login from 'users/Login';
import Rooms from 'rooms/Rooms';
import Messages from 'chat/Messages';
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
    <main
      class="w-screen h-screen grid grid-rows-[auto_1fr_1fr] grid-cols-[1fr_3fr]"
    >
      <Navbar class="col-span-2" />
      <Rooms class="row-span-2" />
      <Messages class="row-span-2" />
    </main>
  </template>
</template>
