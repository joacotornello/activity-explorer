import { t } from '@shared/i18n';
import { Button } from '@shared/ui/atomic/Button';
import { Surface } from '@shared/ui/atomic/Surface';
import { Text } from '@shared/ui/atomic/Text';
import { AuthorFilterOption } from '@shared/ui/composite/AuthorFilterOption';
import { Collapsible } from '@shared/ui/composite/Collapsible';
import { ColorFilterOption } from '@shared/ui/composite/ColorFilterOption';
import { FilterSection } from '@shared/ui/composite/FilterSection';
import { TimeRangeFilterGroup } from '@shared/ui/composite/TimeRangeFilterGroup';
import {
  CalendarIcon,
  FilterIcon,
  PaletteIcon,
  UserIcon,
} from '@shared/ui/icons';
import type { FiltersSidebarProps } from './FiltersSidebar.types';

import './FiltersSidebar.scss';

const MAX_VISIBLE_AUTHORS = 3;

const FiltersSidebar = ({
  authors,
  colors,
  filters,
  onChangeTimeRange,
  onClear,
  onToggleAuthor,
  onToggleColor,
}: FiltersSidebarProps) => {
  const activeFilterCount =
    filters.authors.length +
    filters.colors.length +
    (filters.timeRange === 'all' ? 0 : 1);
  const hasActiveFilters = activeFilterCount > 0;
  const activeFiltersLabel =
    activeFilterCount === 1
      ? t('app.summary.activeFilters_one', { count: activeFilterCount })
      : t('app.summary.activeFilters_other', { count: activeFilterCount });

  return (
    <Surface
      aria-label={t('filters.aria.panel')}
      as="aside"
      className="app-filters-sidebar"
      padding="lg"
    >
      <div className="app-filters-sidebar__header">
        <div>
          <div className="app-filters-sidebar__title-row">
            <FilterIcon className="app-filters-sidebar__title-icon" />
            <Text
              as="h2"
              size="xl"
              weight="medium"
              className="app-filters-sidebar__title"
            >
              {t('filters.title')}
            </Text>
          </div>
          {hasActiveFilters && (
            <Text
              as="p"
              className="app-filters-sidebar__summary"
              color="secondary"
            >
              {activeFiltersLabel}
            </Text>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            aria-label={t('filters.aria.clearAll')}
            disabled={!hasActiveFilters}
            size="sm"
            variant="ghost"
            onClick={onClear}
          >
            {t('filters.clear')}
          </Button>
        )}
      </div>

      <div className="app-filters-sidebar__sections">
        <FilterSection
          icon={<UserIcon />}
          title={t('filters.sections.authors')}
        >
          {authors.length > 0 ? (
            <Collapsible
              expandButtonAriaLabel={t('filters.aria.expandAuthors')}
              maxVisibleItems={MAX_VISIBLE_AUTHORS}
            >
              {authors.map((author) => (
                <Collapsible.Item key={author.id}>
                  <AuthorFilterOption
                    author={author}
                    checked={filters.authors.includes(author.id)}
                    onToggle={onToggleAuthor}
                  />
                </Collapsible.Item>
              ))}
            </Collapsible>
          ) : (
            <Text
              as="p"
              className="app-filters-sidebar__empty"
              color="secondary"
            >
              {t('filters.state.noAuthors')}
            </Text>
          )}
        </FilterSection>

        <FilterSection
          icon={<PaletteIcon />}
          title={t('filters.sections.colors')}
        >
          {colors.length > 0 ? (
            colors.map((facet) => (
              <ColorFilterOption
                key={facet.color}
                checked={filters.colors.includes(facet.color)}
                facet={facet}
                onToggle={onToggleColor}
              />
            ))
          ) : (
            <Text
              as="p"
              className="app-filters-sidebar__empty"
              color="secondary"
            >
              {t('filters.state.noColors')}
            </Text>
          )}
        </FilterSection>

        <FilterSection
          icon={<CalendarIcon />}
          title={t('filters.sections.timeRange')}
        >
          <TimeRangeFilterGroup
            value={filters.timeRange}
            onChange={onChangeTimeRange}
          />
        </FilterSection>
      </div>
    </Surface>
  );
};

export { FiltersSidebar };
