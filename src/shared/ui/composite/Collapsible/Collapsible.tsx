import { Children, useState } from 'react';

import { Button } from '@shared/ui/atomic/Button';
import { hasHiddenItems, getVisibleItemsCount } from './Collapsible.handlers';
import type {
  CollapsibleItemProps,
  CollapsibleProps,
} from './Collapsible.types';

import './Collapsible.scss';

const CollapsibleItem = ({ children }: CollapsibleItemProps) => <>{children}</>;

const CollapsibleRoot = ({
  className,
  contentClassName,
  children,
  expandButtonAriaLabel,
  expandButtonLabel = '...',
  maxVisibleItems,
}: CollapsibleProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const items = Children.toArray(children);

  const visibleItemsCount = getVisibleItemsCount(
    maxVisibleItems,
    items.length,
    isExpanded,
  );
  const visibleItems = items.slice(0, visibleItemsCount);
  const shouldRenderExpandButton =
    !isExpanded && hasHiddenItems(maxVisibleItems, items.length);

  const classes = ['ui-collapsible', className ?? ''].filter(Boolean).join(' ');
  const contentClasses = ['ui-collapsible__content', contentClassName ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className={contentClasses}>{visibleItems}</div>

      {shouldRenderExpandButton ? (
        <Button
          aria-label={expandButtonAriaLabel}
          className="ui-collapsible__toggle"
          variant="ghost"
          onClick={() => setIsExpanded(true)}
          size="lg"
        >
          {expandButtonLabel}
        </Button>
      ) : null}
    </div>
  );
};

const Collapsible = Object.assign(CollapsibleRoot, {
  Item: CollapsibleItem,
});

export { Collapsible };
