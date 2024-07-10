// /**
//  * Copyright @ by Code Lyoko Team. All rights reserved.
//  * Author: Thành Nam Nguyễn
//  */

import clsx from 'clsx';
import Link from '@docusaurus/Link';

import { Tooltip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';

function MaybeLink(props) {
  if (props.href) {
    return <Link {...props} />;
  }
  return <>{props.children}</>;
}
export default function BlogPostItemHeaderAuthor({ author, className }) {
  const { name, title, url, imageURL, email } = author;
  const link = url || (email && `mailto:${email}`) || undefined;

  return (
    <div className={clsx('avatar margin-bottom--lg', className)}>
      {imageURL && (
        <MaybeLink href={link} className="avatar__photo-link">
          <img className="avatar__photo" src={imageURL} alt={name} itemProp="image" />
        </MaybeLink>
      )}

      {name && (
        <div className="avatar__intro" itemProp="author" itemScope itemType="https://schema.org/Person">
          <div className="avatar__name">
            <MaybeLink href={link} itemProp="url">
              <span itemProp="name">
                {name}
                <Tooltip title="Verified" placement="top" arrow>
                  <VerifiedIcon style={{ fill: '#4f92ff' }} fontSize="12px" sx={{ margin: '0px 3px -2px' }} />
                </Tooltip>
              </span>
            </MaybeLink>
          </div>
          {title && (
            <small className="avatar__subtitle" itemProp="description">
              {title}
            </small>
          )}
        </div>
      )}
    </div>
  );
}
