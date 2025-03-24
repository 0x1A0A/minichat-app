<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from './store/users';

const user = useUserStore();

const name = ref('');
const submit = () => {
  user.setUser({ name: name.value });
};
</script>

<template>
  <form
    class="flex flex-col items-center justify-center gap-2 ring-1 ring-black p-4"
    @submit.prevent="submit"
  >
    <input
      type="text"
      v-model.lazy="name"
      placeholder="Username"
      class="w-full bg-gray-300 p-1 outline-none ring-green-500 focus:ring-2 transition-all"
    />

    <button
      type="submit"
      class="w-full bg-green-500 font-bold py-1 hover:py-2 transition-all"
    >
      <span>Login</span>
    </button>
  </form>
</template>
