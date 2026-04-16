import { fireEvent, render, screen } from '@testing-library/react';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders native checkbox and forwards next checked state', () => {
    const onChange = jest.fn();

    render(<Checkbox checked={false} label="Avery Johnson" onChange={onChange} />);

    fireEvent.click(screen.getByRole('checkbox', { name: /avery johnson/i }));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('respects disabled state', () => {
    render(<Checkbox checked={false} disabled={true} label="Disabled filter" onChange={jest.fn()} />);

    const checkbox = screen.getByRole('checkbox', { name: /disabled filter/i });

    expect(checkbox).toBeDisabled();
    expect(checkbox.closest('label')).toHaveClass('is-disabled');
  });
});
