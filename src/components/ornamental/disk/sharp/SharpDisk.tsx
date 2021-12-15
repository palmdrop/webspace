import React from 'react';
import './SharpDisk.scss';

type Props = {
  children ?: React.ReactChild | null | never[]
}

const SharpDisk = ( { children } : Props ) : JSX.Element => {
  return (
    <div className="sharp-disk">
      { children }
    </div>
  );
};

export default SharpDisk;
