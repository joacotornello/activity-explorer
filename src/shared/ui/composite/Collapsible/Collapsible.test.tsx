import { fireEvent, render, screen } from '@testing-library/react';

import { Collapsible } from './Collapsible';

describe('Collapsible', () => {
  it('renders only the configured amount of items before expanding', () => {
    render(
      <Collapsible
        expandButtonAriaLabel="Show remaining items"
        maxVisibleItems={2}
      >
        <Collapsible.Item><span>Alpha</span></Collapsible.Item>
        <Collapsible.Item><span>Beta</span></Collapsible.Item>
        <Collapsible.Item><span>Gamma</span></Collapsible.Item>
      </Collapsible>,
    );

    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.queryByText('Gamma')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Show remaining items' }),
    ).toHaveTextContent('...');
  });

  it('reveals the hidden items after the expand control is clicked', () => {
    render(
      <Collapsible
        expandButtonAriaLabel="Show remaining items"
        maxVisibleItems={2}
      >
        <Collapsible.Item><span>Alpha</span></Collapsible.Item>
        <Collapsible.Item><span>Beta</span></Collapsible.Item>
        <Collapsible.Item><span>Gamma</span></Collapsible.Item>
      </Collapsible>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show remaining items' }));

    expect(screen.getByText('Gamma')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Show remaining items' }),
    ).not.toBeInTheDocument();
  });

  it('does not render an expand control when all items already fit', () => {
    render(
      <Collapsible
        expandButtonAriaLabel="Show remaining items"
        maxVisibleItems={2}
      >
        <Collapsible.Item><span>Alpha</span></Collapsible.Item>
        <Collapsible.Item><span>Beta</span></Collapsible.Item>
      </Collapsible>,
    );

    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Show remaining items' }),
    ).not.toBeInTheDocument();
  });
});
