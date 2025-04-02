import { defineStore } from 'pinia';
import { useWebSocket } from '@vueuse/core';
import { useRoomsStore } from 'rooms/store/rooms';
import { useUserStore } from 'users/store/users';
import { computed, watch } from 'vue';
import { useMessagesStore } from './Messages.store';

export const useChatServer = defineStore('chat-server', () => {
  const { status, data, send, open, close } = useWebSocket(
    import.meta.env.CHAT_SERVER,
    { immediate: false },
  );
  const rooms = useRoomsStore();
  const user = useUserStore();
  const message = useMessagesStore();

  const connectStatus = computed(() => status.value);

  watch(
    () => user.verified,
    () => {
      if (!user.verified) {
        close();
        return;
      }

      open();
      send(`/name ${user.name}`);
    },
    { immediate: true },
  );

  watch(
    () => rooms.selected,
    (room) => {
      if (room) send(`/join ${room}`);
    },
    { immediate: true },
  );

  function sendMessage(msg: string) {
    if (!rooms.selected || !user.name) return;
    send(msg);
    message.add(rooms.selected, msg, user.name);
  }

  watch(data, (data) => {
    if (!rooms.selected) return;
    if (typeof data !== 'string') return;
    if (data.startsWith('/')) {
      return;
    }

    const [user, msg] = data.split(': ');
    if (!msg) return;
    message.add(rooms.selected, msg, user.replace(':', ''));
  });

  return { connectStatus, sendMessage };
});
