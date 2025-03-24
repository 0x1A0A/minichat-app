import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

interface IUser {
  name: string | null;
  authenticated: boolean;
}

export const useUserStore = defineStore('user', {
  state: () =>
    useLocalStorage<IUser>('/user', {
      name: null,
      authenticated: false,
    }),
  actions: {
    setUser(data: { name: string }) {
      this.name = data.name;
      this.authenticated = true;
    },
    logout() {
      this.name = null;
      this.authenticated = false;
    },
  },
  getters: {
    verified: (state) => state.authenticated,
  },
});
