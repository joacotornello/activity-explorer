import { Text } from '@shared/ui/atomic/Text';
import type { FilterSectionProps } from './FilterSection.types';

import './FilterSection.scss';

const FilterSection = ({ children, icon, title }: FilterSectionProps) => (
  <fieldset className="ui-filter-section">
    <legend className="ui-filter-section__legend">
      {icon ? (
        <span aria-hidden="true" className="ui-filter-section__icon">
          {icon}
        </span>
      ) : null}
      <Text size="md">{title}</Text>
    </legend>
    <div className="ui-filter-section__body">{children}</div>
  </fieldset>
);

export { FilterSection };
