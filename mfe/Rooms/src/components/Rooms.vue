<script setup lang="ts">
import CreateRoom from './CreateRoom.vue';
import Room from './Room.vue';
import { useRoomsStore } from '../stores/Room.store';
import { storeToRefs } from 'pinia';

const roomsStore = useRoomsStore();

const { rooms, selected: selected_room } = storeToRefs(roomsStore);

function joinRoom(name: string) {
  roomsStore.add(name).select(name);
}
</script>

<template>
  <div class="bg-gray-100 p-2 grid grid-rows-[auto_1fr] gap-2">
    <CreateRoom @room_created="joinRoom" />
    <div class="flex flex-col gap-1" data-testid="room-container">
      <template v-for="room in rooms">
        <Room
          :name="room"
          :selected="room === selected_room"
          @room_selected="roomsStore.select"
          @remove="roomsStore.remove"
        />
      </template>
    </div>
  </div>
</template>
