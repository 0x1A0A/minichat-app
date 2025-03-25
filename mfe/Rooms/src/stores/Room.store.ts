import { defineStore } from 'pinia';

interface IRoomsStore {
  rooms: Set<string>;
  selected: string | null;
}

export const useRoomsStore = defineStore('rooms', {
  state: () => ({ rooms: new Set(), selected: null }) as IRoomsStore,
  actions: {
    add(name: string) {
      this.rooms.add(name);
      return this;
    },
    remove(name: string) {
      this.rooms.delete(name);
      return this;
    },
    select(name: string) {
      if (!this.rooms.has(name)) return;
      this.selected = name;
      return this;
    },
  },
});
