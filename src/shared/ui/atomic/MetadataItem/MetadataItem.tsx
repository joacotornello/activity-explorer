import { Text } from '../Text';
import type { MetadataItemProps } from './MetadataItem.types';

import './MetadataItem.scss';

const MetadataItem = ({ icon, label, value }: MetadataItemProps) => (
  <div className="ui-metadata-item">
    <dt className="ui-metadata-item__term">
      <Text as="span" aria-hidden="true" className="ui-metadata-item__icon">
        {icon}
      </Text>
      <Text as="span">{label}</Text>
    </dt>
    <dd className="ui-metadata-item__description">{value}</dd>
  </div>
);

export { MetadataItem };
