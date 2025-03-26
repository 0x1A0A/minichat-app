import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { userEvent } from '@testing-library/user-event';
import ChatBox from './ChatBox.vue';

describe('Chat Box', () => {
  test('should Emit event "send" when Press Enter', async () => {
    const { emitted } = render(ChatBox);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test{Enter}');
    expect(emitted()['send']).toBeDefined();
  });

  test('if enter empty text value, it should not emit "send" event', async () => {
    const { emitted } = render(ChatBox);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, '{Enter}');

    const event = emitted()['send'];
    expect(event).not.toBeDefined();
  });

  test('should clear text value after send event', async () => {
    render(ChatBox);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test{Enter}');
    const textarea = input as HTMLTextAreaElement;
    expect(textarea.value).toEqual('');
  });

  test('when press Enter with Shift key, do not emit send event', async () => {
    const { emitted } = render(ChatBox);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test{Shift>}{Enter}{/Shift}');
    expect(emitted()['send']).not.toBeDefined();
  });

  test('when press Enter with Shift key, it add newline to message', async () => {
    render(ChatBox);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test{Shift>}{Enter}{/Shift}line2');
    const textarea = input as HTMLTextAreaElement;
    expect(textarea.value).toEqual('test\nline2');
  });

  test('should emit "send" event when click Send', async () => {
    const { emitted } = render(ChatBox);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Hello world');
    await userEvent.click(screen.getByText('Send'));

    const event = emitted()['send'];
    expect(event[0]).toContain('Hello world');
  });

  test('should not emit event if it empty string when click Send', async () => {
    const { emitted } = render(ChatBox);
    await userEvent.click(screen.getByText('Send'));

    const event = emitted()['send'];
    expect(event).not.toBeDefined();
  });
});
