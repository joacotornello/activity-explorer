import { fireEvent, render, screen } from '@testing-library/react';

import { ColorFilterOption } from './ColorFilterOption';

describe('ColorFilterOption', () => {
  it('renders color facet and toggles selected color', () => {
    const onToggle = jest.fn();

    render(
      <ColorFilterOption
        checked={true}
        facet={{
          color: 'purple',
          label: 'Purple',
        }}
        onToggle={onToggle}
      />,
    );

    const checkbox = screen.getByRole('checkbox', { name: /purple/i });

    expect(checkbox).toBeChecked();
    expect(screen.getByText('Purple')).toBeInTheDocument();

    fireEvent.click(checkbox);

    expect(onToggle).toHaveBeenCalledWith('purple');
  });
});
