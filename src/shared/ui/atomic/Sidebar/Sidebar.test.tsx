import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('renders dialog when open and closes from backdrop', () => {
    const onClose = jest.fn();

    render(
      <Sidebar closeLabel="Close panel" onClose={onClose} open={true}>
        <div>Sidebar body</div>
      </Sidebar>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/sidebar body/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close panel/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders nothing when closed', () => {
    render(
      <Sidebar closeLabel="Close panel" onClose={jest.fn()} open={false}>
        <div>Sidebar body</div>
      </Sidebar>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('moves focus into dialog and traps tab navigation', async () => {
    const onClose = jest.fn();

    render(
      <Sidebar closeLabel="Close panel" onClose={onClose} open={true}>
        <div>
          <button type="button">First action</button>
          <button type="button">Last action</button>
        </div>
      </Sidebar>,
    );

    const firstAction = screen.getByRole('button', { name: /first action/i });
    const lastAction = screen.getByRole('button', { name: /last action/i });

    await waitFor(() => {
      expect(firstAction).toHaveFocus();
    });

    lastAction.focus();
    fireEvent.keyDown(window, {
      key: 'Tab',
    });

    expect(firstAction).toHaveFocus();

    firstAction.focus();
    fireEvent.keyDown(window, {
      key: 'Tab',
      shiftKey: true,
    });

    expect(lastAction).toHaveFocus();

    fireEvent.keyDown(window, {
      key: 'Escape',
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
