import { useEffect, useRef } from 'react';
import {
  focusFirstInteractiveElement,
  restoreFocus,
  trapFocusWithin,
} from '@shared/lib/a11y';
import type { SidebarProps } from './Sidebar.types';

import './Sidebar.scss';

const Sidebar = ({
  children,
  closeLabel,
  labelledBy,
  onClose,
  open,
}: SidebarProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const animationFrameId = window.requestAnimationFrame(() => {
      focusFirstInteractiveElement(panelRef.current);
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();

        return;
      }

      trapFocusWithin(panelRef.current, event);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      restoreFocus(previousActiveElementRef.current);
      previousActiveElementRef.current = null;
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="ui-sidebar">
      <button
        aria-label={closeLabel}
        className="ui-sidebar__backdrop"
        type="button"
        onClick={onClose}
      />
      <div
        aria-labelledby={labelledBy}
        aria-modal="true"
        className="ui-sidebar__panel"
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
};

export { Sidebar };
