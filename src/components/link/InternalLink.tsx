import { Link, LinkProps } from 'react-router-dom';

import './InternalLink.scss';

type Props = LinkProps & {
  className ?: string,
  children : React.ReactNode
}

export const InternalLink = ( { children, className = '', ...linkProps } : Props ) => {
  return (
    <Link 
      className={ `internal-link ${ className }` }
      { ...linkProps }
    >
      { children }
    </Link>
  );
};