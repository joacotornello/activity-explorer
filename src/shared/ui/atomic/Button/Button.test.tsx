import { render, screen } from '@testing-library/react';

import { Button } from './Button';

describe('Button', () => {
  it('renders text children as phrasing content', () => {
    render(<Button>Clear filters</Button>);

    const button = screen.getByRole('button', { name: /clear filters/i });

    expect(button.querySelector('p')).toBeNull();
    expect(button.textContent).toBe('Clear filters');
  });
});
