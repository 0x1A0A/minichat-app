import { defineStore } from 'pinia';

interface IMessage {
  value: string;
  room: string;
  user: string;
}

type MessageStore = { data: Map<string, IMessage[]> };

export const useMessagesStore = defineStore('messages', {
  state: () => ({ data: new Map<string, IMessage[]>() }) as MessageStore,
  actions: {
    get(room: string) {
      return this.data.get(room) ?? [];
    },
    add(room: string, msg: string, user: string) {
      let data: IMessage[] = this.data.get(room) ?? [];
      data.push({ value: msg, room, user });
      this.data.set(room, data);
    },
  },
});
