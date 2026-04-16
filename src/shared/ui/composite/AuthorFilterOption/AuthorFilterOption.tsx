import { getAuthorInitials } from '@entities/note/lib/presentation';

import { Avatar } from '@shared/ui/atomic/Avatar';
import { Checkbox } from '@shared/ui/atomic/Checkbox';
import { Text } from '@shared/ui/atomic/Text';
import type { AuthorFilterOptionProps } from './AuthorFilterOption.types';

import './AuthorFilterOption.scss';

const AuthorFilterOption = ({
  author,
  checked,
  onToggle,
}: AuthorFilterOptionProps) => (
  <div className="ui-author-filter-option">
    <Checkbox
      checked={checked}
      label={
        <Text as="span" className="ui-author-filter-option__label">
          <Avatar initials={getAuthorInitials(author.name)} size="sm" />
          <Text as="span" className="ui-author-filter-option__name">
            {author.name}
          </Text>
        </Text>
      }
      onChange={() => onToggle(author.id)}
    />
  </div>
);

export { AuthorFilterOption };
