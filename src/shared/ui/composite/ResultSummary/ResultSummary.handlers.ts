import { t } from '@shared/i18n';

const getPluralizedSummaryPart = (
  count: number,
  singularKey: string,
  pluralKey: string,
): string => t(count === 1 ? singularKey : pluralKey, { count });

const getResultSummaryText = (
  totalVisible: number,
  activeFilterCount: number,
): string => {
  const notes = getPluralizedSummaryPart(
    totalVisible,
    'app.summary.notes_one',
    'app.summary.notes_other',
  );
  const filters = getPluralizedSummaryPart(
    activeFilterCount,
    'app.summary.activeFilters_one',
    'app.summary.activeFilters_other',
  );

  return t('app.summary.combined', {
    filters,
    notes,
  });
};

export { getResultSummaryText };
