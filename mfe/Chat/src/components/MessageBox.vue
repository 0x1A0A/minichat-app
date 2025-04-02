<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from 'users/store/users';
import { useRoomsStore } from 'rooms/store/rooms';
import { useMessagesStore } from '../stores/Messages.store';
import ChatBox from './ChatBox.vue';
import { useChatServer } from '../stores/ChatServer.store';

const user = useUserStore();
const rooms = useRoomsStore();
const messages = useMessagesStore();
const chatServer = useChatServer();

const room_messages = computed(() => messages.get(rooms.selected!));
</script>

<template>
  <section class="w-full h-full grid grid-rows-[1fr_auto] box-content">
    <div class="bg-gray-100 flex flex-col p-4 gap-0" data-testid="messages-box">
      <div
        v-for="(msg, index) in room_messages"
        class="w-full flex flex-col"
        :class="[
          user.name === msg.user ? 'items-end' : 'items-start',
          user.name === msg.user ? 'pl-8' : 'pr-8',
          room_messages[index - 1]?.user !== msg.user ? 'mt-2' : '',
        ]"
      >
        <span v-if="room_messages[index - 1]?.user !== msg.user">
          [{{ msg.user }}]
        </span>
        <div class="bg-green-400 px-2 py-1 whitespace-pre-wrap">
          <span>{{ msg.value }}</span>
        </div>
      </div>
    </div>
    <ChatBox @send="chatServer.sendMessage" />
  </section>
</template>
