import { render, screen } from '@testing-library/react';

import { Text } from './Text';

describe('Text', () => {
  it('renders the requested heading element with the base text classes', () => {
    render(<Text as="h1">Activity explorer</Text>);

    const heading = screen.getByRole('heading', { level: 1, name: 'Activity explorer' });

    expect(heading).toHaveClass('ui-text', 'ui-text--primary');
  });

  it('defaults to paragraphs when no element is provided', () => {
    render(<Text>Summary copy</Text>);

    expect(screen.getByText('Summary copy', { selector: 'p' })).toHaveClass('ui-text');
  });

  it('supports spans for inline text and decorative wrappers', () => {
    render(
      <Text as="span" className="custom-inline">
        Inline copy
      </Text>,
    );

    expect(screen.getByText('Inline copy', { selector: 'span' })).toHaveClass(
      'ui-text',
      'custom-inline',
    );
  });

  it('supports weight and semantic text color variants', () => {
    render(
      <Text as="p" weight="bold" color="secondary">
        Active filters
      </Text>,
    );

    expect(screen.getByText('Active filters', { selector: 'p' })).toHaveClass(
      'ui-text--secondary',
      'ui-text--bold',
    );
  });

  it('preserves custom classes for composing components', () => {
    render(<Text className="custom-text">Composed copy</Text>);

    expect(screen.getByText('Composed copy', { selector: 'p' })).toHaveClass('custom-text');
  });
});
