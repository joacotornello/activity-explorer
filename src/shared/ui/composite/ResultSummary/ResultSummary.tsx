import { Text } from '../../atomic/Text';
import { getResultSummaryText } from './ResultSummary.handlers';
import type { ResultSummaryProps } from './ResultSummary.types';

const ResultSummary = ({
  activeFilterCount,
  totalVisible,
}: ResultSummaryProps) => (
  <Text as="p" aria-live="polite" className="ui-result-summary" color="secondary">
    {getResultSummaryText(totalVisible, activeFilterCount)}
  </Text>
);

export { ResultSummary };
