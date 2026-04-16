const focusableElementSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const getFocusableElements = (
  container: ParentNode | null,
): HTMLElement[] => {
  if (!container) {
    return [];
  }

  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableElementSelector),
  ).filter((element) => element.getAttribute('aria-hidden') !== 'true');
};

const focusElement = (element: HTMLElement | null): boolean => {
  if (!element) {
    return false;
  }

  element.focus({ preventScroll: true });

  if (typeof element.scrollIntoView === 'function') {
    element.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  }

  return document.activeElement === element;
};

const focusFirstInteractiveElement = (
  container: HTMLElement | null,
): HTMLElement | null => {
  if (!container) {
    return null;
  }

  const [firstFocusableElement] = getFocusableElements(container);

  if (firstFocusableElement) {
    focusElement(firstFocusableElement);

    return firstFocusableElement;
  }

  focusElement(container);

  return container;
};

const restoreFocus = (element: HTMLElement | null): void => {
  if (!element?.isConnected) {
    return;
  }

  focusElement(element);
};

const trapFocusWithin = (
  container: HTMLElement | null,
  event: KeyboardEvent,
): void => {
  if (event.key !== 'Tab' || !container) {
    return;
  }

  const focusableElements = getFocusableElements(container);

  if (focusableElements.length === 0) {
    event.preventDefault();
    focusElement(container);

    return;
  }

  const firstFocusableElement = focusableElements[0] ?? null;
  const lastFocusableElement =
    focusableElements[focusableElements.length - 1] ?? null;
  const activeElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

  if (!firstFocusableElement) {
    event.preventDefault();
    focusElement(container);

    return;
  }

  if (!activeElement || !container.contains(activeElement)) {
    event.preventDefault();
    focusElement(firstFocusableElement);

    return;
  }

  if (event.shiftKey && lastFocusableElement && activeElement === firstFocusableElement) {
    event.preventDefault();
    focusElement(lastFocusableElement);

    return;
  }

  if (!event.shiftKey && activeElement === lastFocusableElement) {
    event.preventDefault();
    focusElement(firstFocusableElement);
  }
};

export {
  focusElement,
  focusFirstInteractiveElement,
  getFocusableElements,
  restoreFocus,
  trapFocusWithin,
};
