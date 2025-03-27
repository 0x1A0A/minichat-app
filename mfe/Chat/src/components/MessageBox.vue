<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from 'users/store/users';
import { useRoomsStore } from 'rooms/store/rooms';
import { useMessagesStore } from '../stores/Messages.store';
import ChatBox from './ChatBox.vue';

const user = useUserStore();
const rooms = useRoomsStore();
const messages = useMessagesStore();

function sendMsg(message: string) {
  messages.add(rooms.selected!, message, user.name!);
}

const room_messages = computed(() => messages.get(rooms.selected!));
</script>

<template>
  <section class="w-full h-full grid grid-rows-[1fr_auto]">
    <div class="bg-gray-100 flex flex-col p-4 gap-0" data-testid="messages-box">
      <div
        v-for="(msg, index) in room_messages"
        class="w-full flex"
        :class="[
          user.name === msg.user ? 'justify-end' : 'justify-start',
          room_messages[index - 1]?.user !== msg.user ? 'mt-2' : '',
        ]"
      >
        <div class="bg-green-400 px-2 py-1">
          <span>{{ msg.value }} {{ msg.user }}</span>
        </div>
      </div>
    </div>
    <ChatBox @send="sendMsg" />
  </section>
</template>
