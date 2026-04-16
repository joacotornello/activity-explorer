import { render, screen } from '@testing-library/react';

import { ApplicationTopbar } from './ApplicationTopbar';

describe('ApplicationTopbar', () => {
  it('renders app title and skip link', () => {
    render(<ApplicationTopbar />);

    expect(screen.getByText('Activity Explorer')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Activity feed' })).toHaveAttribute(
      'href',
      '#activity-feed-title',
    );
  });
});
