import { describe, expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import Room from './Room.vue';

describe('Room', () => {
  test('should emit room_selected when click', async () => {
    const { emitted } = render(Room, { props: { name: 'Room one' } });

    await fireEvent.click(screen.getByText('Room one'));

    const event = emitted();
    expect(event['room_selected']).toBeDefined();
    expect(event['room_selected']).toHaveLength(1);
    expect(event['room_selected'][0]).toContain('Room one');
  });

  test('should emit remove event when click "x"', async () => {
    const { emitted } = render(Room, { props: { name: 'Room one' } });

    await fireEvent.click(screen.getByTestId('room-Room_one-remove'));

    const event = emitted();
    expect(event['remove']).toBeDefined();
    expect(event['remove']).toHaveLength(1);
    expect(event['remove'][0]).toContain('Room one');
  });

  test('if no name props, set it to unknown', () => {
    render(Room);
    expect(screen.getByText('Unknown')).toBeDefined();
  });
});
