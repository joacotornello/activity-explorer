import { fireEvent, render, screen } from '@testing-library/react';

import { FiltersSidebar } from './FiltersSidebar';

const baseProps = {
  authors: [
    { id: 'author-1', name: 'Avery Johnson' },
    { id: 'author-2', name: 'Jorge Silva' },
    { id: 'author-3', name: 'Mina Park' },
    { id: 'author-4', name: 'Noah Martinez' },
    { id: 'author-5', name: 'Priya Patel' },
    { id: 'author-6', name: 'Sarah Chen' },
  ],
  colors: [],
  filters: {
    authors: [],
    colors: [],
    timeRange: 'all' as const,
  },
  onChangeTimeRange: jest.fn(),
  onClear: jest.fn(),
  onToggleAuthor: jest.fn(),
  onToggleColor: jest.fn(),
};

describe('FiltersSidebar', () => {
  it('shows only the first three authors until the list is expanded', () => {
    render(<FiltersSidebar {...baseProps} />);

    expect(screen.getByRole('checkbox', { name: /avery johnson/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /jorge silva/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /mina park/i })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: /noah martinez/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /show all authors/i }));

    expect(screen.getByRole('checkbox', { name: /noah martinez/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /priya patel/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /sarah chen/i })).toBeInTheDocument();
  });

  it('does not show the expand control when three or fewer authors are available', () => {
    render(
      <FiltersSidebar
        {...baseProps}
        authors={baseProps.authors.slice(0, 3)}
      />,
    );

    expect(screen.queryByRole('button', { name: /show all authors/i })).not.toBeInTheDocument();
  });
});
