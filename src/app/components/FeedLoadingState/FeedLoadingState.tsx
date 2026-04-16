import { t } from '@shared/i18n';
import { SkeletonBlock } from '@shared/ui/atomic/SkeletonBlock';
import { Surface } from '@shared/ui/atomic/Surface';
import { LoadingState } from '@shared/ui/composite/LoadingState';
import type { FeedLoadingStateProps } from './FeedLoadingState.types';

import './FeedLoadingState.scss';

const authorWidths = ['7rem', '8.5rem', '6.5rem'] as const;
const badgeWidths = ['3.25rem', '2.75rem', '3.75rem'] as const;
const timeWidths = ['7.5rem', '6.75rem', '8rem'] as const;
const contentLines = [
  ['96%', '78%'],
  ['90%', '72%'],
  ['94%', '68%'],
] as const;

/***
 * A loading state component for the activity feed, displaying skeletons for a list of activity cards.
 */
const FeedLoadingState = ({
  cardCount = 6,
  label = t('feed.state.loading'),
}: FeedLoadingStateProps) => (
  <LoadingState className="app-feed-loading-state" label={label}>
    {Array.from({ length: cardCount }, (_, index) => {
      const widthIndex = index % authorWidths.length;
      const authorWidth = authorWidths[widthIndex] ?? authorWidths[0];
      const badgeWidth = badgeWidths[widthIndex] ?? badgeWidths[0];
      const timeWidth = timeWidths[widthIndex] ?? timeWidths[0];
      const lineWidths = contentLines[widthIndex] ?? contentLines[0];

      return (
        <Surface
          as="article"
          className="app-feed-loading-state__card"
          key={`feed-skeleton-${index}`}
          padding="lg"
        >
          <SkeletonBlock
            className="app-feed-loading-state__accent"
            height="100%"
            shape="rectangle"
            width="var(--spacing-xs)"
          />

          <div className="app-feed-loading-state__body">
            <div className="app-feed-loading-state__header">
              <div className="app-feed-loading-state__meta">
                <SkeletonBlock height="1.125rem" width={authorWidth} />
                <SkeletonBlock
                  height="1.375rem"
                  shape="rectangle"
                  width={badgeWidth}
                />
              </div>
              <SkeletonBlock
                className="app-feed-loading-state__time"
                height="1rem"
                width={timeWidth}
              />
            </div>

            <div className="app-feed-loading-state__lines">
              {lineWidths.map((width) => (
                <SkeletonBlock height="1rem" key={width} width={width} />
              ))}
            </div>
          </div>
        </Surface>
      );
    })}
  </LoadingState>
);

export { FeedLoadingState };
