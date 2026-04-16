import { fireEvent, render, screen } from '@testing-library/react';

import { AuthorFilterOption } from './AuthorFilterOption';

describe('AuthorFilterOption', () => {
  it('renders author details and toggles selected author id', () => {
    const onToggle = jest.fn();

    render(
      <AuthorFilterOption
        author={{
          id: 'author-7',
          name: 'Ava Stone',
        }}
        checked={false}
        onToggle={onToggle}
      />,
    );

    const checkbox = screen.getByRole('checkbox', { name: /ava stone/i });

    expect(checkbox).not.toBeChecked();
    expect(screen.getByText('AS')).toBeInTheDocument();

    fireEvent.click(checkbox);

    expect(onToggle).toHaveBeenCalledWith('author-7');
  });
});
