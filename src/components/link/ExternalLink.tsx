import React from 'react';

type Props = {
  link : string,
  title ?: string,
  onHover ?: ( event : React.MouseEvent ) => void,
  onLeave ?: ( event : React.MouseEvent ) => void,
  children : React.ReactChild | React.ReactChild[] | never[]
};

const ExternalLink = ( { link, title, onHover, onLeave, children } : Props ) : JSX.Element => {
  return (
    <a
      href={ link }
      target="_blank"
      rel="noopener noreferrer"
      title={ title ?? link }
      onMouseEnter={ onHover }
      onMouseLeave={ onLeave }
    >
      { children }
    </a>
  );
};

export default ExternalLink;