import { render, screen } from '@testing-library/react';

import { ResultSummary } from './ResultSummary';

describe('ResultSummary', () => {
  it('renders combined note and active filter counts', () => {
    render(<ResultSummary activeFilterCount={1} totalVisible={2} />);

    expect(screen.getByText(/2 notes/i)).toBeInTheDocument();
    expect(screen.getByText(/1 active filter/i)).toBeInTheDocument();
  });

  it('renders pluralized zero-filter summary', () => {
    render(<ResultSummary activeFilterCount={0} totalVisible={1} />);

    expect(screen.getByText(/1 note/i)).toBeInTheDocument();
    expect(screen.getByText(/0 active filters/i)).toBeInTheDocument();
  });
});
