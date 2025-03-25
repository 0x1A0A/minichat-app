import { fireEvent, render, screen } from '@testing-library/vue';
import { describe, test, expect } from 'vitest';
import Rooms from './Rooms.vue';

describe('Rooms components', () => {
  describe('create Room', () => {
    test('should create room when add create room', async () => {
      render(Rooms);

      const room_input = screen.getByTestId('create-room');
      await fireEvent.update(room_input, 'room One');
      await fireEvent.change(room_input);
      await fireEvent.submit(room_input);

      await fireEvent.update(room_input, 'room Two');
      await fireEvent.change(room_input);
      await fireEvent.submit(room_input);

      expect(screen.getByTestId('room-container').children).toHaveLength(2);
    });

    test('room with the same name will not be created', async () => {
      render(Rooms);

      const room_input = screen.getByTestId('create-room');
      await fireEvent.update(room_input, 'room One');
      await fireEvent.change(room_input);
      await fireEvent.submit(room_input);

      await fireEvent.update(room_input, 'room Two');
      await fireEvent.change(room_input);
      await fireEvent.submit(room_input);

      await fireEvent.update(room_input, 'room One');
      await fireEvent.change(room_input);
      await fireEvent.submit(room_input);

      expect(screen.getByTestId('room-container').children).toHaveLength(2);
    });

    test('always select latest room that emit from "create/join" input', async () => {
      render(Rooms);

      const room_input = screen.getByTestId('create-room');
      await fireEvent.update(room_input, 'room One');
      await fireEvent.change(room_input);
      await fireEvent.submit(room_input);

      await fireEvent.update(room_input, 'room Two');
      await fireEvent.change(room_input);
      await fireEvent.submit(room_input);

      await fireEvent.update(room_input, 'room One');
      await fireEvent.change(room_input);
      await fireEvent.submit(room_input);

      const firstRoom = screen.getByText('room One');
      const secondRoom = screen.getByText('room Two');

      expect(firstRoom.getAttribute('aria-selected')).toEqual('true');
      expect(secondRoom.getAttribute('aria-selected')).toEqual('false');
    });
  });

  describe('Remove Room', () => {
    test('can be able to remove room', async () => {
      render(Rooms);

      const room_input = screen.getByTestId('create-room');
      await fireEvent.update(room_input, 'room One');
      await fireEvent.change(room_input);
      await fireEvent.submit(room_input);

      await fireEvent.update(room_input, 'room Two');
      await fireEvent.change(room_input);
      await fireEvent.submit(room_input);

      const remove = screen.getByTestId('room-room_Two-remove');
      await fireEvent.click(remove);

      expect(screen.getByTestId('room-container').children).toHaveLength(1);
    });
  });

  describe('Select Room', () => {
    test('newly created room will be selected', async () => {
      render(Rooms);

      const room_input = screen.getByTestId('create-room');
      await fireEvent.update(room_input, 'room One');
      await fireEvent.change(room_input);
      await fireEvent.submit(room_input);

      await fireEvent.update(room_input, 'room Two');
      await fireEvent.change(room_input);
      await fireEvent.submit(room_input);

      const firstRoom = screen.getByText('room One');
      const secondRoom = screen.getByText('room Two');

      expect(firstRoom.getAttribute('aria-selected')).toEqual('false');
      expect(secondRoom.getAttribute('aria-selected')).toEqual('true');
    });

    test('select room will set aria-selected to true', async () => {
      render(Rooms);

      const room_input = screen.getByTestId('create-room');
      await fireEvent.update(room_input, 'room One');
      await fireEvent.change(room_input);
      await fireEvent.submit(room_input);

      await fireEvent.update(room_input, 'room Two');
      await fireEvent.change(room_input);
      await fireEvent.submit(room_input);

      const firstRoom = screen.getByText('room One');
      await fireEvent.click(firstRoom);

      expect(firstRoom.getAttribute('aria-selected')).toEqual('true');
    });
  });

  test('should be able to remove selected room', async () => {
    render(Rooms);

    const room_input = screen.getByTestId('create-room');
    await fireEvent.update(room_input, 'room One');
    await fireEvent.change(room_input);
    await fireEvent.submit(room_input);

    await fireEvent.update(room_input, 'room Two');
    await fireEvent.change(room_input);
    await fireEvent.submit(room_input);

    const firstRoom = screen.getByText('room One');
    await fireEvent.click(firstRoom);

    const remove = screen.getByTestId('room-room_One-remove');
    await fireEvent.click(remove);

    expect(screen.getByTestId('room-container').children).toHaveLength(1);
  });
});
