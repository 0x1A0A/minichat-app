<script setup lang="ts">
import { useUserStore } from 'users/store/users';
import { computed, ref } from 'vue';

const user = useUserStore();
const open_menu = ref(false);

const first = computed(() => user.name?.[0] || '-');
</script>

<template>
  <nav class="w-full px-2 py-1 bg-green-400">
    <div>
      <div
        class="peer w-8 h-8 bg-black rounded-full flex items-center justify-center relative cursor-pointer"
        @click.stop="open_menu = !open_menu"
        data-testid="user-icon"
      >
        <span class="text-white"> {{ first }}</span>
      </div>
      <div
        class="bg-white ring-1 ring-black absolute p-2 py-1 flex justify-center top-10 left-0"
        :class="{ hidden: !open_menu }"
      >
        <div class="p-1 bg-green-400 px-4">
          <button @click="user.logout">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>
