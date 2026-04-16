import { createTranslator, defaultLocale, initializeI18n } from './index';

describe('i18n', () => {
  it('resolves nested translation keys', () => {
    const translator = createTranslator({
      activityFeed: {
        loading: 'Loading activity…',
      },
    });

    expect(translator.t('activityFeed.loading')).toBe('Loading activity…');
  });

  it('interpolates named values in translation templates', () => {
    const translator = createTranslator({
      activityFeed: {
        resultCount: '{{count}} notes indexed',
      },
    });

    expect(translator.t('activityFeed.resultCount', { count: 128 })).toBe(
      '128 notes indexed',
    );
  });

  it('falls back to translation key when message missing', () => {
    const translator = createTranslator({
      common: {
        loading: 'Loading…',
      },
    });

    expect(translator.t('common.empty')).toBe('common.empty');
  });

  it('keeps unresolved placeholders visible when interpolation value missing', () => {
    const translator = createTranslator({
      filters: {
        summary: '{{active}} active filters',
      },
    });

    expect(translator.t('filters.summary')).toBe('{{active}} active filters');
  });

  it('sets document language to default locale during bootstrap', () => {
    document.documentElement.lang = '';

    initializeI18n();

    expect(document.documentElement.lang).toBe(defaultLocale);
  });
});
