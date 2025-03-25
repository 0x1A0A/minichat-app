import { describe, expect, test } from 'vitest';
import CreateRoom from './CreateRoom.vue';
import { fireEvent, render, screen } from '@testing-library/vue';

describe('Create Room', () => {
  test('emit event when submit a room name', async () => {
    const { emitted } = render(CreateRoom);
    const input = screen.getByRole('textbox');

    await fireEvent.update(input, 'test');
    await fireEvent.change(input);
    await fireEvent.submit(input);
    const event = emitted();

    expect(event['room_created']).toBeDefined();
    expect(event['room_created']).toHaveLength(1);
    expect(event['room_created'][0]).toContain('test');
  });

  test('do not emit event if input is empty -- ""', async () => {
    const { emitted } = render(CreateRoom);
    const input = screen.getByRole('textbox');
    await fireEvent.update(input, '');
    await fireEvent.change(input);
    await fireEvent.submit(input);
    const event = emitted();

    expect(event['room_created']).not.toBeDefined();
  });

  test('emit event if input is not the same of old value', async () => {
    const { emitted } = render(CreateRoom);
    const input = screen.getByRole('textbox');
    await fireEvent.update(input, 'test');
    await fireEvent.change(input);
    await fireEvent.submit(input);
    await fireEvent.update(input, 'new text');
    await fireEvent.change(input);
    await fireEvent.submit(input);
    const event = emitted();

    expect(event['room_created']).toBeDefined();
    expect(event['room_created']).toHaveLength(2);
    expect(event['room_created'][1]).toContain('new text');
  });

  test('should clear input value when submit', async () => {
    render(CreateRoom);
    const input = screen.getByRole('textbox');

    await fireEvent.update(input, 'test');
    await fireEvent.change(input);
    await fireEvent.submit(input);

    const inputElm = screen.getByRole('textbox') as HTMLInputElement;

    expect(inputElm.value).toEqual('');
  });
});
