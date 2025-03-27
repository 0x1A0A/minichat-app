import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { userEvent } from '@testing-library/user-event';
import MessageBox from './MessageBox.vue';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('users/store/users', () => ({
  useUserStore: vi.fn(() => ({
    name: 'TestUser',
  })),
}));

vi.mock('rooms/store/rooms', () => ({
  useRoomsStore: vi.fn(() => ({
    selected: 'room1',
  })),
}));

describe('Chat Box', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  test('should add text when use type a message', async () => {
    render(MessageBox);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'text{Enter}');
    await userEvent.type(input, 'yeah this should work{Enter}');
    const messages = await screen.findByTestId('messages-box');
    expect(messages.children).toHaveLength(2);
  });

  test('Should Display Text that user typed', async () => {
    render(MessageBox);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'text{Enter}');
    await userEvent.type(input, 'yeah this should work{Enter}');
    const messages = await screen.findByTestId('messages-box');
    for (const child of Array.from(messages.children)) {
      expect(child.textContent).toBeTruthy();
    }
  });
});
