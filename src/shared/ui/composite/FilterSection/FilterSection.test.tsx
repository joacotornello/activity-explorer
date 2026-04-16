import { render, screen } from '@testing-library/react';

import { FilterSection } from './FilterSection';

describe('FilterSection', () => {
  it('renders legend icon and title without changing accessible text', () => {
    render(
      <FilterSection icon={<span data-testid="section-icon">icon</span>} title="Authors">
        <p>Body copy</p>
      </FilterSection>,
    );

    expect(screen.getByTestId('section-icon')).toBeInTheDocument();
    expect(screen.getByText('Authors')).toBeInTheDocument();
    expect(screen.getByText('Body copy')).toBeInTheDocument();
  });
});
