import { fireEvent, render, screen } from '@testing-library/react';

import { TimeRangeFilterGroup } from './TimeRangeFilterGroup';

describe('TimeRangeFilterGroup', () => {
  it('renders native radios and forwards selected preset', () => {
    const onChange = jest.fn();

    render(<TimeRangeFilterGroup value="all" onChange={onChange} />);

    fireEvent.click(screen.getByRole('radio', { name: /today/i }));

    expect(onChange).toHaveBeenCalledWith('today');
  });
});
