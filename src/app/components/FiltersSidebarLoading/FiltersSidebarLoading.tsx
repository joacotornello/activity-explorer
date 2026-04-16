import { t } from '@shared/i18n';
import { SkeletonBlock } from '@shared/ui/atomic/SkeletonBlock';
import { LoadingState } from '@shared/ui/composite/LoadingState';

import './FiltersSidebarLoading.scss';

const authorWidths = ['58%', '64%', '52%'] as const;
const colorWidths = ['40%', '44%', '38%', '36%'] as const;
const timeRangeWidths = ['32%', '40%', '48%'] as const;

const FiltersSidebarLoading = () => (
  <LoadingState
    className="app-filters-sidebar-loading"
    label={t('common.status.loading')}
  >
    <div className="app-filters-sidebar-loading__header">
      <div className="app-filters-sidebar-loading__title-row">
        <SkeletonBlock
          height="var(--spacing-md)"
          shape="rectangle"
          width="var(--spacing-md)"
        />
        <SkeletonBlock height="1.5rem" width="7rem" />
      </div>
      <SkeletonBlock height="var(--spacing-sm)" width="5rem" />
    </div>

    <section className="app-filters-sidebar-loading__section">
      <div className="app-filters-sidebar-loading__section-header">
        <SkeletonBlock
          height="var(--spacing-md)"
          shape="rectangle"
          width="var(--spacing-md)"
        />
        <SkeletonBlock height="1rem" width="4.5rem" />
      </div>
      <div className="app-filters-sidebar-loading__options">
        {authorWidths.map((width) => (
          <div className="app-filters-sidebar-loading__option" key={width}>
            <SkeletonBlock
              height="var(--spacing-md)"
              shape="rectangle"
              width="var(--spacing-md)"
            />
            <SkeletonBlock
              height="var(--spacing-xl)"
              shape="circle"
              width="var(--spacing-xl)"
            />
            <SkeletonBlock height="1rem" width={width} />
          </div>
        ))}
      </div>
    </section>

    <section className="app-filters-sidebar-loading__section">
      <div className="app-filters-sidebar-loading__section-header">
        <SkeletonBlock
          height="var(--spacing-md)"
          shape="rectangle"
          width="var(--spacing-md)"
        />
        <SkeletonBlock height="1rem" width="3.5rem" />
      </div>
      <div className="app-filters-sidebar-loading__options">
        {colorWidths.map((width) => (
          <div className="app-filters-sidebar-loading__option" key={width}>
            <SkeletonBlock
              height="var(--spacing-md)"
              shape="rectangle"
              width="var(--spacing-md)"
            />
            <SkeletonBlock
              height="var(--spacing-lg)"
              shape="rectangle"
              width="var(--spacing-lg)"
            />
            <SkeletonBlock height="1rem" width={width} />
          </div>
        ))}
      </div>
    </section>

    <section className="app-filters-sidebar-loading__section">
      <div className="app-filters-sidebar-loading__section-header">
        <SkeletonBlock
          height="var(--spacing-md)"
          shape="rectangle"
          width="var(--spacing-md)"
        />
        <SkeletonBlock height="1rem" width="5.5rem" />
      </div>
      <div className="app-filters-sidebar-loading__options">
        {timeRangeWidths.map((width) => (
          <div
            className="app-filters-sidebar-loading__option app-filters-sidebar-loading__option--radio"
            key={width}
          >
            <SkeletonBlock
              height="var(--spacing-md)"
              shape="circle"
              width="var(--spacing-md)"
            />
            <SkeletonBlock height="1rem" width={width} />
          </div>
        ))}
      </div>
    </section>
  </LoadingState>
);

export { FiltersSidebarLoading };
